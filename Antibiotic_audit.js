/*
______________________
HOSPITAL FOLDER CODES
''''''''''''''''''''''
Prasanth - 1MXTs-0nNULh00XDQzpT6O-YzNxX9m0RA
MRNH - 1l8OLNBGWyKXhBnAdOrKcxknA7revFjsw
HCG DR - 1HRl6ryzmbJYDqNPPfo2qLuFS9cJJYSKA
HCG Hubli - 11uDaUVf302R6oS__K4xKMda9oZFCh7Gm
HCG Mysore - 0B5KY3EprGQqWOFhQcTdpRXZZcFE
HCG Kolkata - 1EB6r0E-YDxPgowBKsoS6Z6dirUiA-_qJ
HCG Vijayawada - 1umSG1tf9Yhh_e0JMqdyDC4o5cBkb9qL1
*/

function chartCrawler() {
  
    var rootHospFolder = DriveApp.getFolderById("1MXTs-0nNULh00XDQzpT6O-YzNxX9m0RA"); //"MRNH" folder ID
    var hospitalFolders = rootHospFolder.getFolders();
    var files, oldChartFileId, temp, temp2, phFolders, monthFolders, currentMonth, sheets, max, dayValue, nextDayValue, patSumFilled, losCheck, losCheck2, yearFolders, year;
    var day, los, i, cycle, foleyStatus, cvcStatus, fCount, cvcCount, ventStatus, ventDays, sugarSheet, cellValue;
    var totCount, sCount, twa, weightedTotal
    var sheetsNames = []; var sugars = [], dvtStatus = [], sCounts = [], gcsArray = [];
    
    while (hospitalFolders.hasNext()) {
      
      phFolders = hospitalFolders.next();
      if (phFolders.getName() == "Old Charts") {
        yearFolders = phFolders.getFolders();
        while (yearFolders.hasNext) {
          year = yearFolders.next();
          if (year.getName() == "2018") {
            monthFolders = year.getFolders();
            while (monthFolders.hasNext()) {
              currentMonth = monthFolders.next();
              if(currentMonth.getName() == "Dec 2018") { //DESTINATION FOLDER TO PARSE//
                files = currentMonth.getFiles();  
                cycle = 0
                while (files.hasNext()) {
                  
                  oldChartFileId = files.next().getId();     
                  
                  //===========================EXTRACTING LENGTH OF STAY==========================
                  
                  var spreadsheet = SpreadsheetApp.openById(oldChartFileId);
                  sheets = spreadsheet.getSheets();
                  var name = sheets[0].getRange("G4").getValue();
                  var cpmrn = sheets[0].getRange("G5").getValue();
                  var month = sheets[0].getRange("I4").getValue();
                  var hosp = sheets[0].getRange("B2").getValue();
                  
                  dayValue = dayVal(sheets);
                  Logger.log(dayValue);
                  
                  var endsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AB")
                  var ablists = []; var countAs = [];
                  /*var dayValue = 2*/ 
                  
                  for (i = 0; i<dayValue; i++) {
                    var activesheet = sheets[i];
                    countAs.push(countas(activesheet));
                    ablists.push(activesheet.getRange("G12:K23").getValues());
                  }
                  for (i = 0; i<(dayValue); i++) {
                    var lastrowPlus1 = endsheet.getLastRow()+1;
                    var range = ("H"+lastrowPlus1+":L"+(lastrowPlus1+11));
                    endsheet.getRange("G"+lastrowPlus1).setValue(i+1); 
                    endsheet.getRange("M"+lastrowPlus1).setValue(countAs[i]);
                    endsheet.getRange("B"+lastrowPlus1).setValue(name);
                    endsheet.getRange("C"+lastrowPlus1).setValue(cpmrn);
                    endsheet.getRange("D"+lastrowPlus1).setValue(month);
                    endsheet.getRange("N"+lastrowPlus1).setValue(hosp);
                    endsheet.getRange(range).setValues(ablists[i]);
                  }
                  
                  /*cycle = cycle + 1
                  if (cycle >=30) {
                    return;
                  }*/
                  
                }
              }
            }
          }
        }
      }
    }
  }
  
  function dayVal(sheets) {
    
    var max, nextDayValue, dayValue;
    var sheetsNames = []; var sheetsNames = []; var foleyStatus = []; var cvcStatus = []; 
    var ventStatus = []; var dvtStatus = []; var sCounts = []; var gcsArray = []; var sugars = []; //ALL ARRAYS TO NULL
    
    for(cnt = 0; cnt < sheets.length; cnt++) {
      if (sheets[cnt].getName().indexOf("Day") == -1){  //Only look into tabs that have "Day" in their name
        continue;
      }
      max = 1;
      nextDayValue = +(sheets[cnt+1].getRange('K4').getValue()); //Convert to integer
      dayValue = +(sheets[cnt].getRange('K4').getValue());
      
      if( (dayValue > 0) && (dayValue < 1000) ) { //sanity check
        sheetsNames[dayValue] = sheets[cnt].getName();
        /*foleyStatus[dayValue] = sheets[cnt].getRange('D19').getValue();
        cvcStatus[dayValue] = sheets[cnt].getRange('E19').getValue();
        ventStatus[dayValue] = sheets[cnt].getRange('E17').getValue();*/
        if(dayValue > max) {
          max = dayValue;
        }
        if(dayValue == nextDayValue) {
          break;
        }
              
      }
    }
    return dayValue;
  }
  
  
  
  
  
  
  /*function abp1() {
    
    var abss = SpreadsheetApp.openById("1o23pPs4eR-fPQqXwft57WAb_Lk__jMPdnpqnd5kcvH0");
    var endsheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("AB")
    var absheets = abss.getSheets();
    var ablists = []; var countAs = [];
    var dayValue = 2 
    
    for (i = 0; i<dayValue; i++) {
      var activesheet = absheets[i];
      countAs.push(countas(activesheet));
      ablists.push(activesheet.getRange("G12:K23").getValues());
    }
    for (i = 0; i<(dayValue); i++) {
      var lastrowPlus1 = endsheet.getLastRow()+1;
      var range = ("H"+lastrowPlus1+":L"+(lastrowPlus1+11));
      endsheet.getRange("G"+lastrowPlus1).setValue(i+1); 
      endsheet.getRange("M"+lastrowPlus1).setValue(countAs[i])
      endsheet.getRange(range).setValues(ablists[i]);
    }
    
  }*/
  //////////COUNTAS FUNCTION/////////////
  function countas(activesheet) {
    
    var amarray, amrange, countAs, amnocount, pmarray, pmrange, pmnocount;
    
    amarray = activesheet.getRange("M4:M8").getValues();
    amrange = []
    
    for (j=0; j<amarray.length; j++) {
      amrange.push(amarray[j][0])
    }
    amnocount = checkArray(amrange);      
    
    pmarray = activesheet.getRange("M9:M19").getValues();
    pmrange = []
    Logger.log(amrange);
    Logger.log(pmrange);
    for (j=0; j<pmarray.length; j++) {
      pmrange.push(pmarray[j][0])
    }
    pmnocount = checkArray(pmrange);      
    Logger.log("am is "+ amnocount + " pm is " + pmnocount);
    if (amnocount + pmnocount == 1) {
      countAs = 0.5;
    } else if (amnocount + pmnocount == 2) {
      countAs = 0;
    } else if (amnocount + pmnocount == 0) {
      countAs = 1;
    }
    return countAs;
    
  }
  
  function checkArray(range){
    for(var i=0;i<range.length;i++){
      if(range[i] != "")   
        return false;
    }
    return true;
  }