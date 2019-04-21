function apache2() {
  
    var values, physio, temp, tempScore, map, mapScore, hr, hrScore, rr, rrScore, fio2, pao2, paco2, Aa, oxScore, ph, phScore, Na, NaScore, K, KScore, Cr, CrScore, hct, hctScore, tc, tcScore, gcs, gcsScore, 
        surg, age, chr, ageScore; 
    var datasheet, scoresheet, activerow, name, cpmrn, date, apache, apacheMort;
    
    datasheet = SpreadsheetApp.getActive().getSheetByName("workbook");
    scoresheet = SpreadsheetApp.getActive().getSheetByName("APACHE II");
    
    var ui = SpreadsheetApp.getUi();
    
    var response1 = ui.prompt('APACHE2 Calculator', 'Enter begin row?', ui.ButtonSet.OK);
    var begin_row = response1.getResponseText();
    
    var response2 = ui.prompt('APACHE2 Calculator', 'Enter end row?', ui.ButtonSet.OK);
    var end_row = response2.getResponseText();
    
    for (i = begin_row; i <= end_row; i++) {
      
      var range = ("B"+i+":BA"+i)
      values = datasheet.getRange(range).getValues(); Logger.log(values);
      name = values[0][0]; 
      var  physios = []
      physios.push(values[0][0], values[0][3], values[0][28], values[0][29], values[0][33], values[0][30], values[0][34], values[0][35], values[0][36], values[0][38], 
                   values[0][45], values[0][44], values[0][46], values[0][41], values[0][42]); 
      
      var physioArray = []
      
      temp = (((values[0][29])-32)*0.56)
      
      if ((36<=temp & temp<=38.4) | temp == "") {
        tempScore = 0 
      } else if ((38.5<=temp & temp<=38.9) | (34<=temp & temp<=35.9)) {
        tempScore = 1
      } else if (32<=temp & temp<=33.9) {
        tempScore = 2
      } else if ((39<=temp & temp<=40.9) | (30<=temp & temp<=31.9)) {
        tempScore = 3
      } else if (temp >= 41 | temp <= 29.9) {
        tempScore = 4
      }
      physioArray.push(tempScore);
      map = values[0][33];
  
      if ((70<=map & map<=109) | map == "") {
        mapScore = 0 
      } else if ((110<=map & map<=129) | (50<=map & map<=69)) {
        mapScore = 2
      } else if (130<=map & map<=159) {
        mapScore = 3
      } else if (map >= 160 | map <= 49) {
        mapScore = 4
      }
      physioArray.push(mapScore);
      hr = values[0][30];
  
      if ((70<=hr & hr<=109) | hr == "") {
        hrScore = 0 
      } else if ((110<=hr & hr<=139) | (55<=hr & hr<=69)) {
        hrScore = 2
      } else if ((140<=hr & hr<=179) | (40<=hr & hr<=54)) {
        hrScore = 3
      } else if (hr >= 180 | hr <= 39) {
        hrScore = 4
      }
      physioArray.push(hrScore);
      rr = values[0][34];
  
      if ((12<=rr & rr<=24) | rr == "") {
        rrScore = 0 
      } else if ((10<=rr & rr<=11) | (25<=rr & rr<=34)) {
        rrScore = 1
      } else if ((6<=rr & rr<=9)) {
        rrScore = 2
      } else if ((35<=rr & rr<=49)) {
        rrScore = 3
      } else if (rr >= 50 | rr <= 5) {
        rrScore = 4
      }
      physioArray.push(tempScore);
      fio2 = values[0][35]; pao2 = values[0][36]; paco2 = values[0][37]; Aa = ""
      
      if(fio2<0.5) {
        if(pao2>70 | pao2 == "") {
          oxScore = 0
        } else if (61<=pao2 & pao2<=70) {
          oxScore = 1
        } else if (55<=pao2 & pao2<=60) {
          oxScore = 3
        } else if (pao2<55) {
          oxScore = 4
        }
      } else {
        Aa = ((fio2*(760-47))-(paco2/0.8))
        if(Aa<200 | Aa == "") {
          oxScore = 0
        } else if (200<=Aa & Aa<=349) {
          oxScore = 2
        } else if (350<=Aa & Aa<=499) {
          oxScore = 3
        } else if (Aa>=500) {
          oxScore = 4
        }
      }
      if (pao2<0.45) {
        oxScore = 0;
      }
      physioArray.push(oxScore);
      ph = values[0][38];
      
      if ((7.33<=ph & ph<=7.49) | ph == "") {
        phScore = 0 
      } else if ((7.5<=ph & ph<=7.59)) {
        phScore = 1
      } else if (7.25<=ph & ph<=7.32) {
        phScore = 2
      } else if ((7.15<=ph & ph<=7.24) | (7.6<=ph & ph<=7.69)) {
        phScore = 3
      } else if (ph >= 7.7 | ph < 7.15) {
        phScore = 4
      }
      physioArray.push(phScore);
      Na = values[0][45];
      
      if ((130<=Na & Na<=149) | Na == "") {
        NaScore = 0 
      } else if (150<=Na & Na<=154) {
        NaScore = 1
      } else if ((155<=Na & Na<=159) | (120<=Na & Na<=129)) {
        NaScore = 2
      } else if ((160<=Na & Na<=179) | (111<=Na & Na<=119)) {
        NaScore = 3
      } else if (Na >= 180 | Na <= 110) {
        NaScore = 4
      }
      physioArray.push(NaScore);
      K = values[0][44]
      
      if ((3.5<=K & K<=5.4) | K == "") {
        KScore = 0 
      } else if ((5.5<=K & K<=5.9) | (3<=K & K<=3.4)) {
        KScore = 1
      } else if (2.5<=K & K<=2.9) {
        KScore = 2
      } else if (6<=K & K<=6.9) {
        KScore = 3
      } else if (K >= 7 | K < 2.5) {
        KScore = 4
      }
      physioArray.push(KScore);
      Cr = values[0][46];
      
      if ((0.6<=Cr & Cr<=1.4) | Cr == "") {
        CrScore = 0 
      } else if ((1.5<=Cr & Cr<=1.9) | (Cr<0.6)) {
        CrScore = 2
      } else if (2<=Cr & Cr<=3.4) {
        CrScore = 3
      } else if (Cr >= 3.5) {
        CrScore = 4
      }
      physioArray.push(CrScore);
      hct = (values[0][41])*3
      
      if ((30<=hct & hct<=45.9) | hct == "") {
        hctScore = 0 
      } else if (46<=hct & hct<=49.9) {
        hctScore = 1
      } else if ((50<=hct & hct<=59.9) | (20<=hct & hct<=29.9)) {
        hctScore = 2
      } else if (hct >= 60 | hct < 20) {
        hctScore = 4
      }
      physioArray.push(hctScore);
      tc = (values[0][42])/1000
      
      if ((3<=tc & tc<=14.9) | tc == "") {
        tcScore = 0 
      } else if (15<=tc & tc<=19.9) {
        tcScore = 1
      } else if ((20<=tc & tc<=39.9) | (1<=tc & tc<=2.9)) {
        tcScore = 2
      } else if (tc >= 40 | tc < 1) {
        tcScore = 4
      }
      physioArray.push(tcScore);
      gcs = values[0][28];
      if (gcs<3) {
        gcs = 3;
      }
      if (gcs == "") {
        gcs = 0;
      }
      gcsScore = (15 - gcs);
      physioArray.push(gcsScore);
      age = values[0][3];
      
      if ((age<=44) | age == "") {
        ageScore = 0 
      } else if (45<=age & age<=54) {
        ageScore = 2
      } else if (55<=age & age<=64) {
        ageScore = 3
      } else if (65<=age & age<=74) {
        ageScore = 5
      } else if (age>=75) {
        ageScore = 6
      }
      physioArray.push(ageScore);
      
      if (values[0][7] == "Heart Failure Class IV" | values[0][7] == "Cirrhosis" | values[0][7] == "Chronic Lung Disease" | values[0][7] == "Dialysis Dependent") {
        if (values[0][9] == "Elective surgery") {
          surg = 2
        }
        if (values[0][9] == "Non-Operative" | values[0][9] == "Emergency surgery") {
          surg = 5
        }
      } else {
        surg = 0
      }
      
      Logger.log(physioArray)
      physio = tempScore + mapScore + hrScore + rrScore + oxScore + phScore + NaScore + KScore + CrScore + hctScore + tcScore + gcsScore + ageScore
      
      var finalArray = [];
      finalArray.push(physio, surg)
      
      apacheMort = calc(finalArray);
      Logger.log(apacheMort);
      
      function writer() {
              
      }
      
      scoresheet.getRange("A"+i).setValue(name);
      scoresheet.getRange("B"+i).setValue(ageScore);
      scoresheet.getRange("C"+i).setValue(gcsScore);
      scoresheet.getRange("D"+i).setValue(tempScore);
      scoresheet.getRange("E"+i).setValue(mapScore);
      scoresheet.getRange("F"+i).setValue(hrScore);
      scoresheet.getRange("G"+i).setValue(rrScore);
      scoresheet.getRange("H"+i).setValue(fio2);
      scoresheet.getRange("I"+i).setValue(pao2);
      scoresheet.getRange("J"+i).setValue(Aa);
      scoresheet.getRange("K"+i).setValue(oxScore);
      scoresheet.getRange("L"+i).setValue(phScore);
      scoresheet.getRange("M"+i).setValue(NaScore);
      scoresheet.getRange("N"+i).setValue(KScore);
      scoresheet.getRange("O"+i).setValue(CrScore);
      scoresheet.getRange("P"+i).setValue(hctScore);
      scoresheet.getRange("Q"+i).setValue(surg);
      scoresheet.getRange("R"+i).setValue(physio);
      scoresheet.getRange("S"+i).setValue(apacheMort);
      
      /*apache = physio + age + chr;
      */
    }
  }
  
  function calc(finalArray) {
    var apacheMort
    var physio = finalArray[0]; var surg = finalArray[1]; var ageScore = finalArray[2];
    var prob = (-3.517 + (0.146*physio) + 0.603*surg);
    var probinlog = Math.exp(prob);
    apacheMort = (probinlog/(1+probinlog))*100
    return apacheMort;
  }
  