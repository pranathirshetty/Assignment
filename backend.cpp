#include <winsock2.h>
#include <ws2tcpip.h>
#include <iostream>
#include <string>

#pragma comment(lib, "ws2_32.lib")

using namespace std;

string htmlPage =
    "HTTP/1.1 200 OK\r\n"
    "Content-Type: text/html\r\n"
    "Connection: close\r\n"
    "Access-Control-Allow-Origin: *\r\n"
    "\r\n"
    "<!DOCTYPE html>"
    "<html>"
    "<head>"
    "<meta charset='UTF-8' />"
    "<meta name='viewport' content='width=device-width, initial-scale=1' />"
    "<title>Billing System</title>"

    "<style>"
    "body {"
    " margin:0; padding:0; background:linear-gradient(135deg,#8ec5fc,#e0c3fc);"
    " font-family:Arial, sans-serif; height:100vh; display:flex; justify-content:center; align-items:center;"
    "}"
    ".card { width:380px; background:white; padding:30px; border-radius:20px;"
    " box-shadow:0 12px 25px rgba(0,0,0,0.18); }"
    "h2 { text-align:center; margin-bottom:20px; font-size:28px; color:#222; }"
    "label { font-weight:600; margin-top:10px; display:block; }"
    "select, input { width:100%; padding:12px; border-radius:10px; border:1px solid #ccc;"
    " margin-top:5px; margin-bottom:15px; font-size:15px; }"
    "button { width:100%; padding:12px; border:none; border-radius:10px; background:#6a5acd; color:white;"
    " font-size:17px; cursor:pointer; transition:0.3s; }"
    "button:hover { background:#5145c4; transform:scale(1.03); }"
    "#billBox { margin-top:20px; padding:15px; background:#f7f7ff; border-radius:12px;"
    " box-shadow:0 5px 15px rgba(0,0,0,0.12); }"
    "</style>"

    "</head>"
    "<body>"

    "<div class='card'>"
    "<h2>Billing System</h2>"

    "<label>Select Item</label>"
    "<select id='item'>"
    "<option value='Milk,40'>Milk - Rs.40</option>"
    "<option value='Bread,25'>Bread - Rs.25</option>"
    "<option value='Eggs,60'>Eggs - Rs.60</option>"
    "<option value='Rice,50'>Rice - Rs.50/kg</option>"
    "<option value='Sugar,45'>Sugar - Rs.45/kg</option>"
    "</select>"

    "<label>Quantity</label>"
    "<input id='qty' type='number' placeholder='Enter quantity' value='1' />"

    "<button onclick='generateBill()'>Generate Bill</button>"

    "<div id='billBox'></div>"
    "</div>"

    "<script>"
    "function generateBill() {"
    " var data = document.getElementById('item').value.split(',');"
    " var name = data[0];"
    " var price = parseFloat(data[1]);"
    " var qty = parseInt(document.getElementById('qty').value);"

    " var total = price * qty;"
    " var gst = total * 0.05;"
    " var discount = (total > 500) ? total * 0.10 : 0;"
    " var finalAmount = total + gst - discount;"

    " document.getElementById('billBox').innerHTML = "
    " '<h3>🧾 Bill Summary</h3>' +"
    " '<p><b>Item:</b> ' + name + '</p>' +"
    " '<p><b>Price:</b> Rs.' + price + '</p>' +"
    " '<p><b>Quantity:</b> ' + qty + '</p>' +"
    " '<p><b>Total:</b> Rs.' + total + '</p>' +"
    " '<p><b>GST (5%):</b> Rs.' + gst.toFixed(2) + '</p>' +"
    " '<p><b>Discount:</b> Rs.' + discount.toFixed(2) + '</p>' +"
    " '<hr>' +"
    " '<h2>Final Amount: Rs.' + finalAmount.toFixed(2) + '</h2>';"
    "}"
    "</script>"

    "</body>"
    "</html>";

int main()
{

    WSADATA wsaData;
    WSAStartup(MAKEWORD(2, 2), &wsaData);

    SOCKET serverSocket = socket(AF_INET, SOCK_STREAM, 0);

    sockaddr_in serverAddr{};
    serverAddr.sin_family = AF_INET;
    serverAddr.sin_port = htons(5000);
    serverAddr.sin_addr.s_addr = INADDR_ANY;

    bind(serverSocket, (sockaddr *)&serverAddr, sizeof(serverAddr));
    listen(serverSocket, 5);

    cout << "🔥 Server running at http://localhost:5000\n";

    while (true)
    {
        SOCKET client = accept(serverSocket, NULL, NULL);

        char buffer[4096];
        int bytes = recv(client, buffer, sizeof(buffer), 0);

        if (bytes > 0)
        {
            send(client, htmlPage.c_str(), (int)htmlPage.size(), 0);
        }

        closesocket(client);
    }

    closesocket(serverSocket);
    WSACleanup();
    return 0;
}
