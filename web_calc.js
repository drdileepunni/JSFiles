function tool() {
    /*
    
    Here there are four steps
    
    ### Step 1 - Find the slope of tanh curve hospital belongs to - this is done using a scoring system which takes into account what facilities hospital have. 
                 Hospital can be in one of the five curves depending on scores 0-3, 4-7, 8-10, 11-14, 15-17 scores it gets. 
    
    ### Step 2 - Find the x co-ordinate point hospital is at - this depends on the physician staffing pattern of the hospital varies from 0 to 1.2 (0, 0.4, 0.8, 1.2)
    
    ### Step 3 - Find the corresponding y co-ordinate (y) on the curve for the x co-ordinate. This is precalculated and stored in a 2D array. 
    
    ### Step 4 - Under the assumption that 1 year of CP intervention will max out the quality at the hospital, calculate the increase in revenue - this is done by subtracting y from ymax and multiplying 
                 it to the current revenue (increase in revenue) and adding the result to current revenue (final revenue)
    
    */
    
    ///Step 1.1 - Finding the hospital score
    
    var img, labo, anci, pxr, lab, abg, ct, mri, beds, vent, dia, ns, cath, v, revenue, projection;
    
    var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet4");
    
    beds = ss.getRange('B2').getValue(); var b_scr;
    vent = ss.getRange('B3').getValue(); var v_scr;
    
    pxr = ss.getRange('B5').getValue(); ct = ss.getRange('C5').getValue(); mri = ss.getRange('D5').getValue()
    lab = ss.getRange('B7').getValue(); abg = ss.getRange('C7').getValue(); 
    dia = ss.getRange('B9').getValue(); ns = ss.getRange('C9').getValue(); cath = ss.getRange('D9').getValue()
    revenue = ss.getRange('B13').getValue();
    
    pxr;
    
    if (ct == 1 && mri == 0){
      img = ct+1
    } else if (ct == 0 && mri == 1){
      img = 1
    }
    if (ct+mri == 2){
      img = 3
    } else if (ct+mri == 0){
      img = 0
    }
    
    if (lab == 1 && abg == 0) {
      labo = lab+1
    } else if (lab == 0 && abg == 1) {
      labo = 1
    }
    if (lab+abg == 2) {
      labo = 3
    } else if (lab+abg == 0) {
      labo = 0
    }
    
    if (dia == 1) {
      anci = 1
    }
    if (ns == 1) {
      anci = 3
    }
    if (cath == 1) {
      anci = 4
    } 
    if (dia+ns+cath == 0) {
      anci = 0
    }
    
    if (beds<=6) {
      b_scr = 0
    } else if (beds>6 && beds<=12) {
      b_scr = 2
    } else if (beds>12) {
      b_scr = 4
    }
    
    if (vent==0) {
      v_scr = 0
    } else if (vent>0 && vent <=2) {
      v_scr = 1
    } else if (vent>2) {
      v_scr = 2
    }
    
    var tot_scr = pxr + img + labo + anci + b_scr + v_scr; 
    
    //Step 1.2 Create the 2D Array (lines) of pre-calculated y values of all tanh curves and the ymax (Max y value of each curve) stored as the array constants. 
    
    var lines = [[0.834, 0.664, 0.380, 0], [0.667, 0.531, 0.303, 0], [0.500, 0.398, 0.228, 0], [0.333, 0.266, 0.152, 0], [0.167, 0.133, 0.076, 0]]; //y values at x values of [1.2, 0.8, 0.4, 0] for the lines of slopes [tanh, 0.8*tanh, 0.6*tanh, 0.4*tanh, 0.2*tanh]
    var constants = [1, 0.8, 0.6, 0.4, 0.2] //max y values at inf x value
    
    //Step 1.3 Find the curve to which hospital belongs and select the curve charactaristics from the 2D array (lines) and array of ymax values (constants).
    
    var line, c, percent;
    
    if (tot_scr<=3) {
      line = lines[4]; ss.getRange('E11').setValue('Hospital belongs to line E'); c = constants[4];
    } else if (tot_scr>3 && tot_scr<=7) {
      line = lines[3]; ss.getRange('E11').setValue('Hospital belongs to line D'); c = constants[3];
    } else if (tot_scr>7 && tot_scr<=10) {
      line = lines[2]; ss.getRange('E11').setValue('Hospital belongs to line C'); c = constants[2];
    } else if (tot_scr>10 && tot_scr<=14) {
      line = lines[1]; ss.getRange('E11').setValue('Hospital belongs to line B'); c = constants[1];
    } else if (tot_scr>14) {
      line = lines[0]; ss.getRange('E11').setValue('Hospital belongs to line A'); c = constants[0];
    }
    
    //Step 2&3 From the physician staffing (extracted from sheet as v) find the find the x co-ordinate point hospital is at and find the corresponding y co-ordinate (y) on the curve for the x co-ordinate (stored in the 2D array). 
    
    v = ss.getRange('B11').getValue();
    
    if (v == "24/7 in house trained Intensivist (Post MD Med/Anesthesia with Critical Care training") {
      percent = line[0]
    } else if (v == "Day presence of trained Intensivist (Post MD Med/Anesthesia with Critical Care training)") {
      percent = line[1]
    } else if (v == "Day Presence of MD Anesthesia - in charge of ICU") {
      percent = line[2]
    } else if (v == "Open ICU with no trained Intensivist or Anesthetist dedicated to ICU only") {
      percent = line[3]
    }
    
    //Step 4.1 - Get ymax-y to calculate the increase
    
    line = getConstMinus(line, c); 
    
    //Step 4.2 - Revenue * increase * (max revenue increase percentage) = Revenue increase
    
    projection = revenue + (revenue*percent*0.75); Logger.log(percent); Logger.log(revenue*percent*0.4)
    
    ss.getRange('B15').setValue(projection);
    ss.getRange('B16').setValue((percent*0.75))
    
  }
  
  function getConstMinus(line, c) { Logger.log(line); Logger.log(c);
    for (i=0;i<line.length;i++) {
      line[i] = (c-line[i])
    }
    return line;
  }