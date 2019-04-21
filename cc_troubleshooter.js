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
SSNMC - 1KFdejA8Rtkl91ETcug5HA7VEkXFTpgHM
MVJ - 13bX64sIOQaveZSqvBz1_lYV9ia1uICb-
*/

function indivchartCrawler() {
  
    var oldChartFileId = "1sIQVueEbjJ5xy1AO2gsqmemnF6385V-AkDjiv3oIFUw";     
    var arrays = arrayGen(oldChartFileId);
    
    var sheetsNames = arrays[0]; var foleyStatus = arrays[1]; var cvcStatus = arrays[2]; // UNPACKING
    var ventStatus = arrays[3]; var dvtStatus = arrays[4]; var max = arrays[5]; // UNPACKING
    Logger.log(max);
    var los, fCount, cvcCount, ventDays, twa, gcsAvg, dvtCount, dvtpercent, culLink, dcdisp;
    
    dcdisp = indivgetdcdisp(oldChartFileId, max); 
    /*los = getlos(oldChartFileId, max, sheetsNames);
    fCount = getCount(foleyStatus, los); cvcCount = getCount(cvcStatus, los); ventDays = getCount(ventStatus, los);
    twa = getAvgSug(oldChartFileId, max); gcsAvg = getAvgGcs(oldChartFileId, max);
    dvtCount = getCount(dvtStatus, los);
    dvtpercent = (dvtCount/los)*100
    culLink = getculture (oldChartFileId, max); 
    
    var labarray = [];
    labarray = indivlabExtraction(oldChartFileId);
    labarray.push(los, fCount, cvcCount, ventDays, twa, gcsAvg, dvtpercent, culLink, dcdisp);
    writer(labarray)*/
    
  }
  
  
  function getlos(oldChartFileId, max, sheetsNames) {  
    var temp, los;
    for(cnt = max; cnt > 0; cnt--) { // Loop back to find the "Day #" with data
      temp = SpreadsheetApp.openById(oldChartFileId).getSheetByName(sheetsNames[cnt]);
      if(temp.getRange('AG56').isBlank() == false) { // Check if Patient Summary is filled and last two dayValues are not entered same
        los = temp.getRange('K4').getValue();
        break;
      }
    }
    return los;
  }
  
  function getCount(Status, los) {  
    var count = 0;
    for (i = 1; i <= Status.length; i++) {
      if (Status[i] == 'Yes' | Status[i] == 'ETT' | Status[i] == 'Not indicated') {
        count++;
      }
    }
    if (count > los) {
      count = los
    }
    return count;
  }
  
  function getAvgGcs(oldChartFileId, max) {
    var gcsArray = []; var gcsSum = 0; 
    var sheets = SpreadsheetApp.openById(oldChartFileId).getSheets(); 
    for (cnt = (max-1); cnt >= 0; cnt--) { 
      gcsArray[cnt] = sheets[cnt].getRange("F11").getValue();
    }
    for (i = 0; i < gcsArray.length; i++) {
      gcsSum += parseInt(gcsArray[i], 10); // 10 is the base of number system
    }
    var gcsAvg = (gcsSum/gcsArray.length);
    return gcsAvg;
  }
  
  function getAvgSug(oldChartFileId, max) {
    var sheets = SpreadsheetApp.openById(oldChartFileId).getSheets();
    var cellValue, sugarSheet, weightedTotal, twa;
    var totCount = 0; var sCount = 0; var sugars = []; var sCounts = [];
    for (cnt = 0; cnt < max; cnt++) { 
      sugarSheet = sheets[cnt];
      for (i = 4;i <= 28;i++) {
        cellValue = sugarSheet.getRange('X'+i).getValue();
        if (cellValue != "") {
          sugars.push(cellValue);
          sCounts.push(sCount);
          totCount = totCount + sCount;
          sCount = 0;        
        } else {
          sCount = sCount + 1
        }
      }
    }
    sCounts.push(sCount);
    totCount = totCount + sCount - sCounts[0] //Correcting total number of hours counted for the measurement times. 
    
    weightedTotal = 0;
    for (i=0; i<sugars.length; i++) {
      weightedTotal += sugars[i]*sCounts[i+1];
    }
    twa = +(weightedTotal/totCount).toFixed(1);
    if (totCount == 0) {
      twa = "Not measured"
    }
    return twa;
  }
  
  function getculture (oldChartFileId, max) { 
    Logger.log(max);
    ss = SpreadsheetApp.openById(oldChartFileId); 
    var sheets = SpreadsheetApp.openById(oldChartFileId).getSheets(); 
    for (cnt = (max); cnt > 0; cnt--) { 
      var culLink = sheets[cnt].getRange('D31').getFormula(); Logger.log(culLink);
      if (culLink !== "") { 
        break;
      } else {
        continue;
      } 
    }
    if (culLink == null | culLink == "") {
      culLink = "No cultures"
    } 
    return culLink
  }
  
  function indivgetdcdisp (oldChartFileId, max) {
    ss = SpreadsheetApp.openById(oldChartFileId); 
    var sheets = SpreadsheetApp.openById(oldChartFileId).getSheets(); 
    for (cnt = (max); cnt >= 0; cnt--) { 
      var dcdisp = sheets[cnt].getRange('K8').getValue(); 
      if (dcdisp != "") {
        return dcdisp;
      }
    }
  }
  
  function arrayGen (oldChartFileId) {
    
    var sheets, max = 1, nextDayValue, dayValue; var returnarray = [];
    var sheetsNames = [], foleyStatus = [], cvcStatus = [], ventStatus = [], dvtStatus = [], gcsArray = []; 
    
    sheets = SpreadsheetApp.openById(oldChartFileId).getSheets();  
    
    for(cnt = 0; cnt < sheets.length; cnt++) {
      if (sheets[cnt].getName().indexOf("Day") == -1){  //Only look into tabs that have "Day" in their name
        continue;
      }
      
      nextDayValue = +(sheets[cnt+1].getRange('K4').getValue()); //Convert to integer
      dayValue = +(sheets[cnt].getRange('K4').getValue());
      
      if( (dayValue > 0) && (dayValue < 1000) ) { //sanity check
        sheetsNames[dayValue] = sheets[cnt].getName();
        foleyStatus[dayValue] = sheets[cnt].getRange('D19').getValue();
        cvcStatus[dayValue] = sheets[cnt].getRange('E19').getValue();
        ventStatus[dayValue] = sheets[cnt].getRange('E17').getValue();
        dvtStatus[dayValue] = sheets[cnt].getRange('I29').getValue();
        if(dayValue > max) {
          max = dayValue;
        }
        if(dayValue == nextDayValue) {
          break;
        }
        
      }
    }
    returnarray.push(sheetsNames, foleyStatus, cvcStatus, ventStatus, dvtStatus, max);
    return returnarray;
  }
  
  
  function writer(labarray) {
    
    var ScannerSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("workbook"); //@@@@@@@@@@@@@@CHANGE TO THE DESTINATION SHEET NAME@@@@@@@@@@@@@@//
    var lastRowPlus1 = ScannerSheet.getLastRow() + 1;
    
    ScannerSheet.getRange('B' + lastRowPlus1).setValue(labarray[0]); //name
    ScannerSheet.getRange('C' + lastRowPlus1).setFormula(labarray[6]); //linkText
    ScannerSheet.getRange('D' + lastRowPlus1).setValue(labarray[2]); //date
    ScannerSheet.getRange('E' + lastRowPlus1).setValue(labarray[1]); //age
    ScannerSheet.getRange('F' + lastRowPlus1).setValue(labarray[3]); //gender
    ScannerSheet.getRange('G' + lastRowPlus1).setValue(labarray[4]); //hospital
    ScannerSheet.getRange('X' + lastRowPlus1).setValue(labarray[41]); //ventdays - DUPLICATE
    ScannerSheet.getRange('AA' + lastRowPlus1).setValue(labarray[39]); //fcount - DUPLICATE
    ScannerSheet.getRange('AB' + lastRowPlus1).setValue(labarray[40]); //cvccount - DUPLICATE
    ScannerSheet.getRange('AC'+ lastRowPlus1).setValue(labarray[7]); //ventmode 
    ScannerSheet.getRange('AD' + lastRowPlus1).setValue(labarray[8]); //gcs
    ScannerSheet.getRange('AE' + lastRowPlus1).setValue(labarray[10]); //temperature
    ScannerSheet.getRange('AF' + lastRowPlus1).setValue(labarray[13]); //hr
    ScannerSheet.getRange('AG' + lastRowPlus1).setValue(labarray[12]); //spo2 
    ScannerSheet.getRange('AH' + lastRowPlus1).setValue(labarray[9]); //sbp
    ScannerSheet.getRange('AI' + lastRowPlus1).setValue(labarray[11]); //map
    ScannerSheet.getRange('AJ' + lastRowPlus1).setValue(labarray[14]); //rr
    ScannerSheet.getRange('AK' + lastRowPlus1).setValue(labarray[15]); //fio2
    ScannerSheet.getRange('AL' + lastRowPlus1).setValue(labarray[16]); //pao2
    ScannerSheet.getRange('AM' + lastRowPlus1).setValue(labarray[17]); //paco2
    ScannerSheet.getRange('AN' + lastRowPlus1).setValue(labarray[18]); //ph
    ScannerSheet.getRange('AP' + lastRowPlus1).setValue(labarray[20]); //hco3
    ScannerSheet.getRange('AQ' + lastRowPlus1).setValue(labarray[24]); //Hb
    ScannerSheet.getRange('AR' + lastRowPlus1).setValue(labarray[25]); //tlc
    ScannerSheet.getRange('AS' + lastRowPlus1).setValue(labarray[26]); //platelets
    ScannerSheet.getRange('AT' + lastRowPlus1).setValue(labarray[21]); //K
    ScannerSheet.getRange('AU' + lastRowPlus1).setValue(labarray[22]); //Na
    ScannerSheet.getRange('AV' + lastRowPlus1).setValue(labarray[23]); //SCr
    ScannerSheet.getRange('AW' + lastRowPlus1).setValue(labarray[28]); //BUr
    ScannerSheet.getRange('AX' + lastRowPlus1).setValue(labarray[29]); //Bili
    ScannerSheet.getRange('AY' + lastRowPlus1).setValue(labarray[27]); //uo 
    ScannerSheet.getRange('AZ' + lastRowPlus1).setValue(labarray[31]); //lac 
    ScannerSheet.getRange('BA' + lastRowPlus1).setValue(labarray[30]); //inr 
    ScannerSheet.getRange('H' + lastRowPlus1).setValue(labarray[32]); //hist 
    ScannerSheet.getRange('K' + lastRowPlus1).setValue(labarray[33]); //surgical or non-surgical 
    ScannerSheet.getRange('L' + lastRowPlus1).setValue(labarray[34]); //category of dx
    ScannerSheet.getRange('M' + lastRowPlus1).setValue(labarray[35]); //specific diagnosis
    ScannerSheet.getRange('I' + lastRowPlus1).setValue(labarray[36]); //APACHE PMH
    ScannerSheet.getRange('J' + lastRowPlus1).setValue(labarray[37]); //SAPS PMH - @@@@@@@LAST UNPUSHED VARIABLE@@@@@@@
    ScannerSheet.getRange('O' + lastRowPlus1).setValue(labarray[38]);//los - PUSHED VARIABLE1
    ScannerSheet.getRange('P' + lastRowPlus1).setValue(labarray[39]);//Foley days	- PUSHED VARIABLE2
    ScannerSheet.getRange('Q' + lastRowPlus1).setValue(labarray[40]);//CVC days - PUSHED VARIABLE3
    ScannerSheet.getRange('R' + lastRowPlus1).setValue(labarray[41]);//Vent days - PUSHED VARIABLE4
    ScannerSheet.getRange('S' + lastRowPlus1).setValue(labarray[42]);//TWA Glucose - PUSHED VARIABLE5
    ScannerSheet.getRange('T' + lastRowPlus1).setValue(labarray[43]);//Average GCS - PUSHED VARIABLE6
    ScannerSheet.getRange('U' + lastRowPlus1).setValue(labarray[44]);//DVT percent - PUSHED VARIABLE7 
    ScannerSheet.getRange('Z' + lastRowPlus1).setValue(labarray[45]);//Culture data - PUSHED VARIABLE8
    ScannerSheet.getRange('BD' + lastRowPlus1).setValue(labarray[46]);//DC Disposition - PUSHED VARIABLE9 - @@@LAST PUSHED VARIABLE@@@
  }
  
  function indivlabExtraction(oldChartFileId) {
    
    var activesheet, activesheet2, checkcell, lab1a, lab1b, lab1c, lab2a, lab2b, lab2c, vit1a, vit1b, vit2a, vit2b, dxrange;
    var name, age, date, gender, hospital, cpmrn, linkText, hist; var surg, dx, spdx, apache, saps, dcdisp;
    var dev1, spo21, Plt1, dev2, spo22, Plt2;
    var dev, gcs, sbp, temperature, map, spo2, hr, rr, fio2, pao2, paco2, ph, Aa, hco3, K, Na, SCr, Hb, tlc, Plt, uo, BUr, Bili, inr, lac;
    var gcs1, sbp1, temp1, map1, hr1, rr1, fio21, pao21, paco21, ph1, Aa1, hco31, K1, Na1, SCr1, Hb1, tlc1, uo1, BUr1, Bili1, inr1, lac1;
    var gcs2, sbp2, temp2, map2, hr2, rr2, fio22, pao22, paco22, ph2, Aa2, hco32, K2, Na2, SCr2, Hb2, tlc2, uo2, BUr2, Bili2, inr2, lac2;
    
    activesheet = SpreadsheetApp.openById(oldChartFileId).getSheets()[0];
    activesheet2 = SpreadsheetApp.openById(oldChartFileId).getSheets()[1];
    
    lab1a = activesheet.getRange("C22:C30").getValues();lab2a = activesheet2.getRange("C22:C30").getValues();
    lab1b = activesheet.getRange("E22:E30").getValues();lab2b = activesheet2.getRange("E22:E30").getValues();
    lab1c = activesheet.getRange("G24:G31").getValues();lab2c = activesheet2.getRange("G24:G31").getValues();
    vit1a = activesheet.getRange("C12:C19").getValues();vit2a = activesheet2.getRange("C12:C19").getValues();
    vit1b = activesheet.getRange("E12:E17").getValues();vit2b = activesheet2.getRange("E12:E17").getValues();
    dxrange = ss.getRange('B6:K8').getValues(); 
    
    name = activesheet.getRange("G4").getValue();
    age = activesheet.getRange("E4").getValue();
    date = activesheet.getRange("I4").getValue();
    gender = activesheet.getRange("B4").getValue();
    hospital = activesheet.getRange("B2").getValue();
    cpmrn = activesheet.getRange("G5").getValue();
    hist = activesheet.getRange("B6").getValue();
    gcs1 = activesheet.getRange("F11").getValue();
    
    surg = dxrange[0][7]; dx = dxrange[0][8]; spdx = dxrange[0][9];
    apache = dxrange[1][8]; saps = dxrange[1][9];
    
    uo1 = vit1a[4][0];fio21 = vit1b[4][0];
    /*//////////////*/dev1 = vit1b[5][0];
    
    Na1 = lab1a[0][0]; ph1 = lab1b[0][0];
    K1 = lab1a[1][0]; paco21 = lab1b[1][0];
    /*//////////////*/pao21 = lab1b[2][0]; Bili1 = lab1c[0][0];
    /*//////////////*/hco31 = lab1b[3][0];/*//////////////*/
    /*//////////////*/lac1 = lab1b[4][0];/*//////////////*/
    BUr1 = lab1a[5][0];/*//////////////*//*//////////////*/
    SCr1 = lab1a[6][0];/*//////////////*//*//////////////*/
    tlc1 = lab1a[7][0];/*//////////////*//*//////////////*/
    Hb1 = lab1a[8][0]; Plt1 = lab1b[8][0]; inr1 = lab1c[6][0]
    
    checkcell = activesheet2.getRange("B3").getValue();
    
    if (checkcell == "Sex") {
      
      uo2 = vit2a[4][0];fio22 = vit2b[4][0];
      /*//////////////*/dev2 = vit2b[5][0];
      
      Na2 = lab2a[0][0]; ph2 = lab2b[0][0];
      K2 = lab2a[1][0]; paco22 = lab2b[1][0];
      /*//////////////*/pao22 = lab2b[2][0]; Bili2 = lab2c[0][0];
      /*//////////////*/hco32 = lab2b[3][0];/*//////////////*/
      /*//////////////*/lac2 = lab2b[4][0];/*//////////////*/
      BUr2 = lab2a[5][0];/*//////////////*//*//////////////*/
      SCr2 = lab2a[6][0];/*//////////////*//*//////////////*/
      tlc2 = lab2a[7][0];/*//////////////*//*//////////////*/
      Hb2 = lab2a[8][0]; Plt2 = lab2b[8][0]; inr2 = lab2c[6][0]
      
    }
    
    if (dev1 == "") {
      dev = dev2;
    } else dev = dev1;
    if (gcs1 == "") {
      gcs = gcs2;
    } else gcs = gcs1;
    if (fio21 == "") {
      fio2 = fio22
    } else fio2 = fio21
    if (pao21 == "") {
      pao2 = pao22
    } else pao2 = pao21
    if (paco21 == "") {
      paco2 = paco22
    } else paco2 = paco21
    if (ph1 == "") {
      ph = ph2
    } else ph = ph1
    if (hco31 == "") {
      hco3 = hco32
    } else hco3 = hco31
    if (K1 == "") {
      K = K2
    } else K = K1
    if (Na1 == "") {
      Na = Na2
    } else Na = Na1
    if (SCr1 == "") {
      SCr = SCr2
    } else SCr = SCr1
    if (Hb1 == "") {
      Hb = Hb2
    } else Hb = Hb1
    if (tlc1 == "") {
      tlc = tlc2
    } else tlc = tlc1
    if (Plt1 == "") {
      Plt = Plt2;
    } else Plt = Plt1;
    if (uo2 == "" || uo2 == 0) { //Takes D2 u/o which is the first 24hr u/o
      uo = uo1
    } else uo = uo2
    if (BUr1 == "") {
      BUr = BUr2
    } else BUr = BUr1
    if (Bili1 == "") {
      Bili = Bili2
    } else Bili = Bili1
    if (inr1 == "") {
      inr = inr2
    } else inr = inr1
    if (lac1 == "") {
      lac = lac2
    } else lac = lac1
    
    for (itr = 4; itr <=28; itr++) {
      if (activesheet.getRange('M'+itr).getValue() != "") {
        hr = activesheet.getRange('M'+itr).getValue();
        spo2 = activesheet.getRange('N'+itr).getValue();
        map = activesheet.getRange('O'+itr).getValue();
        sbp = activesheet.getRange('P'+itr).getValue();
        temperature = activesheet.getRange('R'+itr).getValue();
        rr = activesheet.getRange('S'+itr).getValue();
        break;
      }
    }
    
    linkText = ('=HYPERLINK("https://docs.google.com/spreadsheets/d/'+oldChartFileId+'", "'+cpmrn+'")');
  Logger.log("temp is " + temperature)
    return [name, age, date, gender, hospital, cpmrn, linkText, dev, gcs, sbp, temperature, map, spo2, hr, rr, 
            fio2, pao2, paco2, ph, Aa, hco3, K, Na, SCr, Hb, tlc, Plt, uo, BUr, Bili, inr, lac, hist, 
            surg, dx, spdx, apache, saps]
  
  }
  