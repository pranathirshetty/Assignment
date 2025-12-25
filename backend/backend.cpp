#include <winsock2.h>
#include <iostream>
#include <string>
#include <vector>

#pragma comment(lib, "ws2_32.lib")
using namespace std;

string extract_json_body(const string &request)
{
    size_t pos = request.find("\r\n\r\n");
    if (pos == string::npos)
        return "";
    return request.substr(pos + 4);
}

int get_value(const string &json, const string &key)
{
    string k = "\"" + key + "\":";
    size_t p = json.find(k);
    if (p == string::npos)
        return 0;

    size_t start = p + k.length();
    size_t end = json.find_first_of(",}", start);
    return stoi(json.substr(start, end - start));
}

vector<pair<int, int>> products = {
    {101, 150}, {102, 80}, {103, 250}, {104, 60}, {105, 120}};

int calculate_bill(const string &body)
{
    int total = 0;
    size_t pos = body.find("{");
    while (pos != string::npos)
    {
        size_t end = body.find("}", pos);
        string item = body.substr(pos, end - pos + 1);
        int id = get_value(item, "id");
        int qty = get_value(item, "qty");

        for (auto &p : products)
            if (p.first == id)
                total += p.second * qty;

        pos = body.find("{", end);
    }
    return total;
}

int main()
{
    WSADATA wsa;
    WSAStartup(MAKEWORD(2, 2), &wsa);

    SOCKET server = socket(AF_INET, SOCK_STREAM, 0);
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_port = htons(5000);
    addr.sin_addr.s_addr = INADDR_ANY;

    bind(server, (sockaddr *)&addr, sizeof(addr));
    listen(server, 5);

    cout << "Backend running on http://localhost:5000\n";

    while (true)
    {
        SOCKET client = accept(server, NULL, NULL);
        char buf[4096]{};
        recv(client, buf, sizeof(buf), 0);
        string req(buf);

        if (req.find("OPTIONS") == 0)
        {
            string cors =
                "HTTP/1.1 204 No Content\r\n"
                "Access-Control-Allow-Origin: *\r\n"
                "Access-Control-Allow-Methods: POST, OPTIONS\r\n"
                "Access-Control-Allow-Headers: Content-Type\r\n\r\n";
            send(client, cors.c_str(), cors.size(), 0);
            closesocket(client);
            continue;
        }

        string body = extract_json_body(req);
        double total = calculate_bill(body);
        double tax = total * 0.10;
        double finalAmount = total + tax;

        string json =
            "{ \"total\": " + to_string(total) +
            ", \"tax\": " + to_string(tax) +
            ", \"finalAmount\": " + to_string(finalAmount) + " }";

        string res =
            "HTTP/1.1 200 OK\r\n"
            "Content-Type: application/json\r\n"
            "Access-Control-Allow-Origin: *\r\n"
            "Content-Length: " +
            to_string(json.size()) + "\r\n\r\n" +
            json;

        send(client, res.c_str(), res.size(), 0);
        closesocket(client);
    }
}
