#property copyright "Paul de Renty"
#property link        ""
#property version    "1.00"
#property strict

#include <price_feed_conf.mqh>
#include <sockets.mqh>

ClientSocket    *client = NULL; //client address is available on global scope
ushort          port;
string          msg = NULL;

void  send_quote() {
    msg = IntegerToString(TimeCurrent()) + "," + DoubleToString(Ask) + "," + DoubleToString(Bid) + "\n";
    // Print("Sending: " + msg);
    client.SendStr(msg);
}

int        OnInit() {
    ushort attempt = 0;

    port = get_feed_port(Symbol());
    Comment("TCP Router: Expecting requests from server " + URI + ":" + IntegerToString(port));
    if (!(client = socket_connect(client, URI, port, 2))) {
      //return (INIT_FAILED);
    }
    // timer_set = EventSetMillisecondTimer(100);
    return(INIT_SUCCEEDED);
}

void  OnDeinit(const int reason) {
    delete client;
}

void  OnTick() {
    if (client != NULL && client.IsSocketConnected()) {
        send_quote();
    }
    else {
        //Print("Error: Socket uninitialized or disconnected");
        (client = socket_connect(client, URI, port, 2));
    }
}
