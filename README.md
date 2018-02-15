# bigear
Opening CobaltStrike to a wider world

Setup:
 * install rabbitmq: sudo apt install rabbitmq-server
 * install java (you need that for CS anyway)
 * download java deps and place them in your CS directory:
     - [amqp-client](http://repo1.maven.org/maven2/com/rabbitmq/amqp-client/5.1.2/amqp-client-5.1.2.jar)
     - [slf4j-api](http://central.maven.org/maven2/org/slf4j/slf4j-api/1.7.21/slf4j-api-1.7.21.jar)
     - [org.json](https://search.maven.org/remotecontent?filepath=org/codeartisans/org.json/20161124/org.json--20161124.jar)
 * put the spy.cna in your cobaltstrike directory
 * run it: ./agscript 1.2.3.4 50050 bigear s3cret ./spy.cna
 * build your elasticsearch server (somehow, it's not hard)
 * install logstash
 * edit the bigear.conf and put in your logstash destination
 
