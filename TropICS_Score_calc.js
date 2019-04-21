function trop() {
  
    var sheet, row, name, cpmrn, date, apache, apacheMort, saps, sapsMort, tropics, tropicsMort;
    var surgery, hb, bun, bun_mmol, gcs, sbp, rr, surgScore; var sbpScore, rrScore;
    
    datasheet = SpreadsheetApp.getActive().getSheetByName("workbook");
    scoresheet = SpreadsheetApp.getActive().getSheetByName("APACHE II");
    
    var ui = SpreadsheetApp.getUi();
    
    var response1 = ui.prompt('TropICS Calculator', 'Enter begin row?', ui.ButtonSet.OK);
    var begin_row = response1.getResponseText();
    
    var response2 = ui.prompt('TropICS Calculator', 'Enter end row?', ui.ButtonSet.OK);
    var end_row = response2.getResponseText();
    
    sheet = SpreadsheetApp.getActive().getSheetByName("workbook");
    
    for (row = begin_row; row <= end_row; row++) {
      surgery = sheet.getRange('K'+row).getValue();
      hb = sheet.getRange('AQ'+row).getValue();
      bun = (sheet.getRange('AW'+row).getValue())/2.14;
      bun_mmol = (sheet.getRange('AW'+row).getValue())*0.166;
      gcs = sheet.getRange('AD'+row).getValue();
      sbp = sheet.getRange('AH'+row).getValue();
      rr = sheet.getRange('AJ'+row).getValue();
      
      var array = [];
      array.push(surgery, hb, bun, gcs, sbp, rr);
      
      /*if (sbp >= 90 && sbp <= 180) {
        sbpScore = 0;
      } else if (sbp > 180) {
        sbpScore = sbp - 180;
      } else if (sbp < 90) {
        sbpScore = 90 - sbp;
      };
      
      if (rr >= 12 && rr <= 24) {
        rrScore = 0;
      } else if (rr > 24) {
        rrScore = rr - 24;
      } else if (rr < 12) {
        rrScore = 12 - rr;
      };
      
      if (surgery == "Non Surgical" | surgery == "Emergency surgery") {
        surgScore = 1
      } else { 
        surgScore = 0
      };
      Logger.log('surgScore is ' + surgScore + ' rrScore is ' + rrScore + ' sbpScore is ' + sbpScore + ' gcs is ' + gcs + ' bun is ' + bun + ' hb is ' + hb);
      Logger.log('tropics is ' + tropics);
      var prob = (0.588 + (0.547*surgScore) + (0.005*rrScore) + (0.002*sbpScore) - (0.150*gcs) + (0.006* Math.log(bun_mmol)) - (0.098*hb)); 
      var probinlog = Math.exp(prob);
      tropicsMort = (probinlog/(1+probinlog))*100
      */
      tropics = scoreCalc(array);
      tropicsMort = mortCalc(tropics);
      
      sheet.getRange('BB'+row).setValue(tropicsMort);
      sheet.getRange('BC'+row).setValue(tropics);
      
    }
    
  }
  
  function checkArray(array){
    for(var i=0;i<array.length;i++){
      if(array[i] == "" | array[i] == 0)   
        return false;
    }
    return true;
  }
  
  function scoreCalc(array) {
    
    var surgScore, hbScore, bunScore, gcsScore, sbpScore, rrScore;
    
    var surgery = array[0]; var hb = array[1]; var bun = array[2];
    var gcs = array[3]; var sbp = array[4]; var rr = array[5] 
    
    if (surgery == "Non-Operative" | surgery == "Emergency surgery") {
      surgScore = 1.5
    } else { 
      surgScore = 0
    };
    
    if (hb >= 12.1 | hb == "") {
      hbScore = 0
    } else if (hb <= 12 && hb >= 8.1) {
      hbScore = 1
    } else if (hb <= 8 && hb >= 4.1) {
      hbScore = 3
    } else if (hb <= 4) {
      hbScore = 0
    };
    
    if (bun <= 59.9 | bun == "") {
      bunScore = 0
    } else if (bun >= 60 && hb <= 119) {
      bunScore = 1
    } else if (bun >= 120 && hb <= 179) {
      bunScore = 2
    } else if (bun >= 180 && hb <= 239) {
      bunScore = 3
    } else if (bun >= 240 && hb <= 299) {
      bunScore = 4
    } else if (bun >= 300 && hb <= 359) {
      bunScore = 5
    } else if (bun >= 360 && hb <= 419) {
      bunScore = 6
    } else if (bun >= 420 && hb <= 479) {
      bunScore = 7
    } else if (bun >= 480 && hb <= 539) {
      bunScore = 8
    } else if (bun >= 540 && hb <= 599) {
      bunScore = 9
    } else if (bun > 600) {
      bunScore = 10
    };
    
    if (gcs >= 14.1 | gcs == "") {
      gcsScore = 0
    } else if (gcs <= 14 && gcs >= 11.1) {
      gcsScore = 1
    } else if (gcs <= 11 && gcs >= 9.1) {
      gcsScore = 2
    } else if (gcs <= 9 && gcs >= 6.1) {
      gcsScore = 3
    } else if (gcs <= 6 && gcs >= 4.1) {
      gcsScore = 4
    } else if (gcs <= 4) {
      gcsScore = 5
    };
    
    if (sbp >= 90.1 | sbp == "") {
      sbpScore = 0
    } else if (sbp <= 90 && sbp >= 60.1) {
      sbpScore = 0.5
    } else if (sbp <= 60 && sbp >= 30.1) {
      sbpScore = 1
    };
    
    if ((rr >= 12 && rr <= 24) | rr == "") {
      rrScore = 0
    } else if (rr <= 11.9 && rr >= 8) {
      rrScore = 0.5
    } else if (rr <= 7.9 && rr >= 6) {
      rrScore = 1
    } else if (rr <= 5.9 && rr >= 4) {
      rrScore = 1.5
    } else if (rr < 3.9) {
      rrScore = 2
    } else if (rr >= 24.1 && rr <= 28) {
      rrScore = 0.5
    } else if (rr >= 28.1 && rr <= 30) {
      rrScore = 1
    } else if (rr >= 30.1 && rr <= 32) {
      rrScore = 1.5
    } else if (rr >= 32.1 && rr <= 34) {
      rrScore = 2
    } else if (rr >= 34.1 && rr <= 36) {
      rrScore = 2.5
    } else if (rr >= 36.1 && rr <= 38) {
      rrScore = 3
    } else if (rr >= 38) {
      rrScore = 3.5
    }
    var tropics = surgScore + hbScore + bunScore + sbpScore + gcsScore + rrScore;
    return tropics;
  }
  
  function mortCalc(tropics) {
    var tropicsMort
    if (tropics <= 0.49) {
        tropicsMort = 0
      } else if (tropics == 0.5) {
        tropicsMort = 5
      } else if (tropics == 1) {
        tropicsMort = 7 
      } else if (tropics == 1.5) { 
        tropicsMort = 8
      } else if (tropics == 2) {
        tropicsMort = 9
      } else if (tropics == 2.5) {
        tropicsMort = 11
      } else if (tropics == 3) {
        tropicsMort = 14 
      } else if (tropics == 3.5) { 
        tropicsMort = 15
      } else if (tropics == 4) {
        tropicsMort = 17
      } else if (tropics == 4.5) {
        tropicsMort = 20
      } else if (tropics == 5) {
        tropicsMort = 23
      } else if (tropics == 5.5) { 
        tropicsMort = 27
      } else if (tropics == 6) {
        tropicsMort = 30
      } else if (tropics == 6.5) {
        tropicsMort = 35
      } else if (tropics == 7) {
        tropicsMort = 39
      } else if (tropics == 7.5) { 
        tropicsMort = 44
      } else if (tropics == 8) {
        tropicsMort = 48
      } else if (tropics == 8.5) {
        tropicsMort = 53
      } else if (tropics == 9) {
        tropicsMort = 57
      } else if (tropics == 9.5) { 
        tropicsMort = 61
      } else if (tropics == 10) {
        tropicsMort = 65
      } else if (tropics == 10.5) {
        tropicsMort = 70
      } else if (tropics == 11) {
        tropicsMort = 72
      } else if (tropics == 11.5) { 
        tropicsMort = 76
      } else if (tropics == 12) {
        tropicsMort = 79
      } else if (tropics == 12.5) {
        tropicsMort = 82
      } else if (tropics == 13) {
        tropicsMort = 84
      } else if (tropics == 13.5) { 
        tropicsMort = 86
      } else if (tropics == 14) {
        tropicsMort = 88
      } else if (tropics == 14.5) {
        tropicsMort = 91
      } else if (tropics == 15) {
        tropicsMort = 92
      } else if (tropics == 15.5) { 
        tropicsMort = 93
      } else if (tropics == 16) {
        tropicsMort = 94
      } else if (tropics == 16.5) {
        tropicsMort = 95
      } else if (tropics == 17) {
        tropicsMort = 95.5
      } else if (tropics == 17.5) {
        tropicsMort = 96
      } else if (tropics == 18) {
        tropicsMort = 96.5
      } else if (tropics == 18.5) { 
        tropicsMort = 97
      } else if (tropics == 19) {
        tropicsMort = 97.5
      } else if (tropics == 19.5) {
        tropicsMort = 98
      } else if (tropics == 20) {
        tropicsMort = 98.5
      } else if (tropics == 20.5) { 
        tropicsMort = 99
      } else if (tropics == 21) {
        tropicsMort = 99
      }
    return tropicsMort;
  }
  