var Imap = require("node-imap"),
  inspect = require("util").inspect;
const { simpleParser } = require("mailparser");

var fs = require("fs"),
  fileStream;

var imap = new Imap({
  user: "t29449022@gmail.com",
  password: "bkxotrqdhcsxpokm",
  host: "imap.gmail.com",
  port: 993,
  tls: true,
});

function openInbox(callback) {
  imap.openBox("INBOX", true, callback);
}

imap.once("ready", function () {
  openInbox(function (err, box) {
    if (err) throw err;

    const fetchOptions = {
      bodies: ["HEADER", "TEXT"],
      markSeen: false,
    };

    const f = imap.seq.fetch("1:*", fetchOptions); // Fetch all messages

    f.on("message", function (msg, seqno) {
      // console.log("Processing message #%d", seqno);

      const messageParts = [];

      msg.on("body", function (stream, info) {
        let buffer = "";

        stream.on("data", function (chunk) {
          buffer += chunk.toString("utf8");
        });

        stream.on("end", function () {
          messageParts.push(buffer);
        });
      });

      msg.once("end", function () {
        // console.log("Message #%d completed", seqno);

        // Process the message parts as needed
        const messageText = messageParts.join("");
        var regEx = /(^|\W)Buyer's Contact Details:($|\W)/;
        var detail = messageText.match("/(^|\W)Buyer's Contact Details:($|\W)/", "");
        if (messageText.match(regEx)) {
          let result = messageText.indexOf("Buyer's Contact Details");
          let result2 = messageText.indexOf("Buylead Details:");
          let result4 = messageText.indexOf("Click to call");
          // var name = detail.indexOf("Details");
          // console.log(name);
          let result3 = messageText.substring(result, result2);
          let result5 = messageText.substring(result, result4);
          // console.log(result5);
          // console.log(result);
          // console.log(result2);
          console.log(result3);
          let objectDate = new Date();

          let day = objectDate.getDate();
          let month = objectDate.getMonth();
          let add1Month = month + 1;
          let year = objectDate.getFullYear();
          let hh = objectDate.getHours();
          let mm = objectDate.getMinutes();
          // let ss = objectDate. getSeconds();
          // let session = "AM"; if(hh > 12){ session = "PM"; } hh = (hh < 10) ?;
          let format1 =
            day + "_" + add1Month + "_" + year + "#" + hh + "_" + mm + ".txt";
          // fs.writeFile(format1, result3, (err) => {
          //   if (err) {
          //     console.error(err);
          //   }
          // });
        } else {
          // console.log("Word not found");
          // console.log(messageText);
        }
      });
    });

    f.once("error", function (err) {
      // console.log("Fetch error: " + err);
    });

    f.once("end", function () {
      // console.log("Done fetching all messages!");
      imap.end();
    });
  });
});

imap.once("error", function (err) {
  // console.log(err);
});

imap.once("end", function () {
  // console.log("Connection ended");
});

imap.connect();
