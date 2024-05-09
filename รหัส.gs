function doGet(e) {
  return HtmlService.createTemplateFromFile("index").evaluate() ## ส่วนนี้ทำให้ไฟล์ รหัส กับ index เชื่อมกันเพื่อที่จะใช้แจ้งเหตุฉุกเฉิน
}

function userClick(data) {
  let ss = SpreadsheetApp.openById('1st9MUmaGhU8mNnfU5OPRkmClBRNfUWOqQ9cAGxhjCTs'); # ส่วนนี้ให้นำลิ้งค์ของ Google Sheet มาใส่เพื่อที่ตอนกดแจ้งเหตูข้อมูลจะบันทึกใน Google Sheet
  let sheet = ss.getSheets()[0];
  let response = Maps.newGeocoder().reverseGeocode(data.lat, data.lon);
  let geoAddress = response.results[0].formatted_address;
  sheet.appendRow([data.username,Utilities.formatDate(new Date(), "GMT+7", "MM/dd/yyyy HH:mm:ss"), `${data.lat},${data.lon}`, geoAddress,data.types,data.phonenumber, data.details])

  var strYear543 = parseInt(Utilities.formatDate(new Date(), "Asia/Bangkok", "yyyy")) + 543;  
  var strhour=Utilities.formatDate(new Date(), "Asia/Bangkok", "HH");
  var strMinute=Utilities.formatDate(new Date(), "Asia/Bangkok", "mm");
  var strMonth1 = Utilities.formatDate(new Date(), "Asia/Bangkok", "M");
  var strMonthCut1 = ["", "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]  
  var strMonthThai = strMonthCut1[strMonth1];
  var strDay = Utilities.formatDate(new Date(), "Asia/Bangkok", "d"); // d ไม่มี 0 นำ dd มี 0 นำ
  var daytime=strDay+' '+strMonthThai+' '+strYear543+ ' เวลา '+strhour+':'+strMinute+' น.';
  
  var text_data1 = '❗❗❗แจ้งเหตุฉุกเฉิน❗❗❗\n';
  text_data1 +='\📣ประเภทเรื่องที่แจ้ง📣\n'+data.types+'\n📣รายละเอียดเรื่องที่แจ้ง📣\n'+data.details+'\n⏰วัน-เวลา⏰\n'+daytime+'\n👨‍💼ชื่อ-นามสกุล👩‍💼\n'+data.username+'\n📞เบอร์โทร📞\n'+data.phonenumber+'\n📌พิกัด\n'+data.lat+","+data.lon + '\n🏡ที่อยู่\n'+geoAddress
      
var latitude = data.lat
var longitude = data.lon
var map = Maps.newStaticMap()
.setSize(800,800)  //(Max:1300 X 1300)
.setLanguage('TH')
.setMobile(true)
.setMapType(Maps.StaticMap.Type.HYBRID)

map.addMarker(latitude, longitude)
var mapBlob = map.getBlob()
var mapUrl = map.getMapUrl()
sendHttpPostImage(text_data1,mapBlob)
}

## ส่วนนี้จะเป็น Token ของกลุ่มไลน์ สามารถนำมาจาก Line Notify ได้
function sendHttpPostImage(mapUrl, mapBlob){
var token = ("kLdqLmCUdZvhcQhkptPAKccsqD7ABpc0M3W8aEMXKaA")
var formData = {
'message' : '\n'+mapUrl,
'imageFile': mapBlob

}
var options =
{
"method"  : "post",
"payload" : formData,  
"headers" : {"Authorization" : "Bearer "+ token}
};

UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}
