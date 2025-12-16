#include <winsock2.h>
#include <iostream>
#include <string>
#include <sstream>
#include <vector>
#include <algorithm>

#pragma comment(lib, "ws2_32.lib")
using namespace std;

// --- Helper function to extract the JSON body from the HTTP request ---
string extract_json_body(const string &request)
{
    // Look for the double newline that separates headers from the body
    size_t body_start = request.find("\r\n\r\n");
    if (body_start == string::npos)
    {
        return ""; // No body found
    }
    return request.substr(body_start + 4); // +4 to skip \r\n\r\n
}

// --- Helper function to extract a value from a JSON string (very basic/unreliable for production) ---
int get_value_from_json(const string &json_str, const string &key)
{
    string search_key = "\"" + key + "\":";
    size_t key_pos = json_str.find(search_key);
    if (key_pos == string::npos)
        return 0;

    size_t val_start = key_pos + search_key.length();
    size_t val_end = json_str.find_first_of(",}", val_start);

    try
    {
        string value_str = json_str.substr(val_start, val_end - val_start);
        return stoi(value_str);
    }
    catch (...)
    {
        return 0;
    }
}

// --- BILLING LOGIC: UPDATED PRODUCT LIST TO MATCH FRONTEND IDs and Prices ---
const vector<pair<int, int>> product_prices = {
    {101, 150}, // Cheeseburger
    {102, 80},  // Large Fries
    {103, 250}, // Chicken Wings
    {104, 60},  // Soda Pop
    {105, 120}  // Choco Shake
};

int calculate_bill_total(const string &json_body)
{
    int total_cost = 0;

    // The JSON body is an array of objects: [{"id":101,"name":"Cheeseburger","price":150,"qty":1}, {...}]

    size_t start = json_body.find('{');
    while (start != string::npos)
    {
        size_t end = json_body.find('}', start);
        if (end == string::npos)
            break;

        string item_json = json_body.substr(start, end - start + 1);

        int item_id = get_value_from_json(item_json, "id");
        int item_qty = get_value_from_json(item_json, "qty");

        if (item_id > 0 && item_qty > 0)
        {
            // Find the price for the item_id
            int price = 0;
            for (const auto &p : product_prices)
            {
                if (p.first == item_id)
                {
                    price = p.second;
                    break;
                }
            }
            total_cost += price * item_qty;
        }

        start = json_body.find('{', end);
    }

    return total_cost;
}

int main()
{
    WSADATA wsa;
    if (WSAStartup(MAKEWORD(2, 2), &wsa) != 0)
    {
        cerr << "Failed to initialize Winsock.\n";
        return 1;
    }

    SOCKET server = socket(AF_INET, SOCK_STREAM, 0);
    if (server == INVALID_SOCKET)
    {
        cerr << "Could not create socket.\n";
        WSACleanup();
        return 1;
    }

    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(5000);
    addr.sin_addr.s_addr = INADDR_ANY;

    if (bind(server, (sockaddr *)&addr, sizeof(addr)) == SOCKET_ERROR)
    {
        cerr << "Bind failed with error: " << WSAGetLastError() << "\n";
        closesocket(server);
        WSACleanup();
        return 1;
    }

    if (listen(server, 5) == SOCKET_ERROR)
    {
        cerr << "Listen failed with error: " << WSAGetLastError() << "\n";
        closesocket(server);
        WSACleanup();
        return 1;
    }

    cout << "Billing backend running on http://localhost:5000\n";

    while (true)
    {
        SOCKET client = accept(server, NULL, NULL);
        if (client == INVALID_SOCKET)
        {
            cerr << "Accept failed with error: " << WSAGetLastError() << "\n";
            continue;
        }

        char buffer[4096] = {0};
        int bytes_received = recv(client, buffer, sizeof(buffer) - 1, 0);
        if (bytes_received == SOCKET_ERROR || bytes_received == 0)
        {
            closesocket(client);
            continue;
        }
        buffer[bytes_received] = '\0'; // Null-terminate the buffer

        string request(buffer);

        // 🔥 HANDLE CORS PREFLIGHT (OPTIONS request)
        if (request.find("OPTIONS") == 0)
        {
            string corsResponse =
                "HTTP/1.1 204 No Content\r\n"
                "Access-Control-Allow-Origin: *\r\n"
                "Access-Control-Allow-Methods: POST, GET, OPTIONS\r\n"
                "Access-Control-Allow-Headers: Content-Type\r\n"
                "Content-Length: 0\r\n"
                "\r\n";

            send(client, corsResponse.c_str(), corsResponse.length(), 0);
            closesocket(client);
            continue;
        }

        // ---- BILLING LOGIC ----
        string json_body = extract_json_body(request);

        int total_cost = calculate_bill_total(json_body);

        // Use float/double for proper tax calculation
        double total = static_cast<double>(total_cost);
        double tax_rate = 0.10; // 10% tax
        double tax = total * tax_rate;
        double finalAmount = total + tax;

        // Round to 2 decimal places for JSON output (optional for simple demo)
        string body =
            "{ \"total\": " + to_string(total) +
            ", \"tax\": " + to_string(tax) +
            ", \"finalAmount\": " + to_string(finalAmount) + " }";

        // For debugging the C++ console:
        cout << "Request body: " << json_body.substr(0, min((int)json_body.length(), 100)) << "...\n";
        cout << "Calculated Total: " << total << ", Final: " << finalAmount << "\n";

        string response =
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: application/json\r\n"
            "Access-Control-Allow-Origin: *\r\n"
            "Content-Length: " +
            to_string(body.length()) + "\r\n"
                                       "\r\n" +
            body;

        send(client, response.c_str(), response.length(), 0);
        closesocket(client);
    }

    closesocket(server);
    WSACleanup();
    return 0;
}