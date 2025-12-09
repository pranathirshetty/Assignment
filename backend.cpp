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
    "<title>Billing System</title>"

    "<style>"
    "body { background:#e6d7ff; font-family:Arial; display:flex; justify-content:center; align-items:center; height:100vh; margin:0; }"
    ".card { width:440px; background:white; padding:25px; border-radius:20px; box-shadow:0 8px 20px rgba(0,0,0,0.2); }"
    "h2 { text-align:center; margin-bottom:15px; }"
    "select { width:100%; height:120px; padding:10px; border-radius:10px; margin-bottom:10px; }"
    ".qtyBox { display:flex; justify-content:space-between; margin-bottom:8px; }"
    ".qtyBox input{ width:80px; padding:5px; border-radius:8px; }"
    "button { width:100%; padding:12px; background:#6a5acd; color:white; border:none; border-radius:10px; font-size:17px; cursor:pointer; }"
    "button:hover { background:#5a48d3; }"
    "#billBox { margin-top:20px; background:#f4f4ff; padding:15px; border-radius:10px; }"
    "table { width:100%; border-collapse:collapse; }"
    "th,td { padding:6px; border-bottom:1px solid #ccc; }"
    "th { background:#ddd; }"
    "</style>"
    "</head>"

    "<body>"
    "<div class='card'>"
    "<h2>🧾 Billing System</h2>"

    "<label>Select Items (CTRL + Click)</label>"
    "<select id='item' multiple onchange='renderQtyInputs()'>"
    "<option value='Milk,40'>Milk - Rs.40</option>"
    "<option value='Bread,25'>Bread - Rs.25</option>"
    "<option value='Eggs,60'>Eggs - Rs.60</option>"
    "<option value='Rice,50'>Rice - Rs.50</option>"
    "<option value='Sugar,45'>Sugar - Rs.45</option>"
    "</select>"

    "<div id='qtyFields'></div>"

    "<button onclick='generateBill()'>Generate Bill</button>"
    "<div id='billBox'></div>"

    "</div>"

    "<script>"

    "function renderQtyInputs(){"
    " let list=[...document.getElementById('item').selectedOptions];"
    " let box=document.getElementById('qtyFields');"
    " box.innerHTML='';"

    " list.forEach(opt=>{"
    "   let name=opt.value.split(',')[0];"
    "   box.innerHTML += `"
    "   <div class='qtyBox'>"
    "     <span>${name}</span>"
    "     <input id='qty_${name}' value='1' type='number' min='1'>"
    "   </div>`;"
    " });"
    "}"

    "function generateBill(){"
    " let items=[...document.getElementById('item').selectedOptions];"
    " if(items.length===0){ alert('⚠ Select at least one item daaa'); return;}"

    " let rows=''; let total=0;"

    " items.forEach(opt=>{"
    "   let [name,price]=opt.value.split(','); price=parseFloat(price);"
    "   let qty=parseInt(document.getElementById('qty_'+name).value);"
    "   let sum=price*qty; total+=sum;"
    "   rows+=`"
    "   <tr>"
    "     <td>${name}</td>"
    "     <td style='text-align:center;'>${qty}</td>"
    "     <td>Rs.${sum}</td>"
    "   </tr>`;"
    " });"

    " let gst=total*0.05;"
    " let discount=(total>500)?total*0.10:0;"
    " let final=total+gst-discount;"

    " document.getElementById('billBox').innerHTML = `"
    " <h3>Final Bill</h3>"
    " <table>"
    "   <tr><th>Item</th><th>Qty</th><th>Total</th></tr>"
    "   ${rows}"
    " </table>"
    " <p><b>Subtotal:</b> Rs.${total}</p>"
    " <p><b>GST 5%:</b> Rs.${gst.toFixed(2)}</p>"
    " <p><b>Discount:</b> Rs.${discount.toFixed(2)}</p>"
    " <h2>Total Payable: Rs.${final.toFixed(2)}</h2>`;"
    "}"

    "</script>"
    "</body></html>";

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

    cout << "🔥 Server running @ http://localhost:5000\n";

    while (true)
    {
        SOCKET client = accept(serverSocket, NULL, NULL);
        char buffer[4096];
        int bytes = recv(client, buffer, sizeof(buffer), 0);

        if (bytes > 0)
            send(client, htmlPage.c_str(), (int)htmlPage.size(), 0);

        closesocket(client);
    }

    WSACleanup();
    return 0;
}
