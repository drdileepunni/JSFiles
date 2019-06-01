function NoteGen() {
  
  var activesheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  var stringArray = returnStringArray(activesheet); 
  
  var count = 0
  for (i=0;i<stringArray.length;i++) {
    if (stringArray[i] != '') {
      activesheet.getRange('C'+(37+count)).setValue(stringArray[i])
      count += 1
    } else {
      count += 0
    }
  }
  
}

function Interpret(system) {
  var interp = [];  
  for (i=0;i<system.length;i++){
    if (system[i][1] == '' | system[i][1] == 0){
      interp[i] = 'no value'
      continue;
    }
    interp[i] = rangeLookup(system[i]);
  }
  return interp;
}

function getString(name, interp) {
  var string = '';
  for (i=0;i<interp.length;i++){
    if (interp[i] == 'high' | interp[i] == 'low') {
      string =  string + name[i][0] + ' is ' + interp[i] + ' ('+(name[i][1]).toFixed(1)+')' + '. ';  
    }
  }
  return string
}

function rangeLookup(arr) { Logger.log(arr);
  var test = arr[0]; var result = arr[1]; 
  var range = getNormalRange(test); var interp;
  
  for (j=0;j<range.length;j++){ 
    if (result<range[0]){
      interp = 'low'
    } else if (result>range[1]){
      interp = 'high'
    } else {
      interp = 'normal'
    } 
  }
  return interp; 
}

function getNormalRange(test) {
  
  var dict = {
    'Na': [130, 145],
    'K': [3.5, 5],
    'Urea': [7, 20], 
    'Creatinine': [0.6, 1.2],
    'Chloride': [95, 105],
    'CO2': [22, 28],
    'Urine output': [1000, 4000],
    'Heart rate': [40, 100],
    'MAP': [65, 100],
    'SBP': [90, 160], 
    'Saturation': [90, 100],
    'RR': [8, 20], 
    'FiO2 (%)': [21, 100], 
    'pH': [7.36, 7.44], 
    'PaCO2': [36, 44], 
    'PaO2': [60, 100], 
    'Bicarb': [18, 26],
    'Lactate': [0.4, 2],
    'Bili (Total)': [0.1, 1.2],
    'Bili(direct)': [0.01, 0.3],
    'SGOT(AST)': [8, 48], 
    'SGPT(ALT)': [7, 55], 
    'ALK phos': [44, 147],
    'Albumin': [3.4, 5.4],
    'WBC': [4000, 10000], 
    'Hb': [12, 17],
    'Plt': [225000, 450000]
  }
  
  var range = dict[test];
  return range
  
}

function isNormal(arr) { 
  var isnor = 0;
  for (k=0;k<arr.length;k++) {
    if (arr[k]=='normal') {
      isnor += 1;
    } else if (arr[k]=='no value') {
      isnor += 0.1
    }
  }
  return isnor;
}

function returnStringArray(activesheet) {
  
  var variables = getVariables(activesheet); 
  
  var cvs = variables[0], neph = variables[1], resp = variables[2], gi = variables[3], patdetails = variables[4], heme = variables[5];
  var drugrange = activesheet.getRange('G12:G23').getValues(), day = patdetails[4]; 
  
  //CVS
  var c_interp = Interpret(cvs); 
  if (c_interp[1] != 'low') { 
    var c_string1 = 'Hemodynamically stable. '
    } else { 
      var c_string1 = 'Hemodynamically unstable. '
      }
  var c_string2 = getString(cvs, c_interp); 
  var final_cvs = 'CVS:' + c_string1 + c_string2 
  
  //CNS
  var gcs = activesheet.getRange("C11:E11").getValues(); 
  var cns_string = 'CNS: '+'E'+gcs[0][0]+'V'+gcs[0][1]+'M'+gcs[0][2]; 
  
  //RENAL
  var n_interp = Interpret(neph.slice(0,7)), net = neph[7], f_status = neph[8];
  var r_string1, r_string2, r_string3, final_ren;
  if (net != 0 && net != '') {
    r_string1 = 'Net I/O in last 24 hours is '+ net + ' ml. '
  } else {
    r_string1 = ''
  }
  if (f_status == 'Yes') {
    r_string3 = 'Foley in situ. Monitor I/O'
  } else {
    r_string3 = 'No Foley catheter. Monitor I/O'
  }
  r_string2 = getString(neph, n_interp);
  final_ren = 'Renal: ' + r_string1 + r_string2 + r_string3;
  
  //RESP
  var r_interp = Interpret(resp.slice(0,8)); 
  var final_resp = 'Resp: ' + getRespString(resp, r_interp);
  
  //GI
  var g_interp = Interpret(gi);
  var final_gi = getGIString(gi, g_interp, activesheet);
  
  //ID
  //Step 1: Preparing antibiotic array to compare with
  var antibiotics = SpreadsheetApp.openById('1EbMCAtpQgkSLLMZYzl5-TrnpdeDrU8oG2TKg0POj3dI').getSheetByName('Antibiotics').getRange('B1:B242').getValues(); 
  var ablist = [];
  for (i=0;i<antibiotics.length;i++) {
    ablist.push(antibiotics[i][0]);
  }
  //Step 2: Preprocessing drug names to compare
  var daystr = /\s+\(day\s+\d\)/g
  for (i=0;i<drugrange.length;i++) {
    drugrange[i][0] = drugrange[i][0].toLowerCase();
    drugrange[i][0] = drugrange[i][0].replace(daystr, '')
  } 
  //Step 3: Comparing and making the list of antibiotics
  var sheetabs = [];
  for (i=0;i<drugrange.length;i++) { 
    if (ablist.indexOf(drugrange[i][0])>-1) {
      sheetabs.push(drugrange[i][0]);
    }
  }
  //Step 4: Making final string
  var final_id = 'ID: Hospital day ' + day + '. Current active antibiotics are ' + sheetabs.join(', ') + '. '
  
  //ENDO
  var glucose, time, final_endo;
  for (itr = 28; itr >=4; itr--) {
    if (activesheet.getRange('X'+itr).getValue() != "") {
      glucose = activesheet.getRange('X'+itr).getValue();
      if (itr < 20) {
        time = itr+4
      } else {
        time = itr-20
      }
    }
    
    
  } 
  if (time == null) {
    final_endo = 'Endo: No GRBS recorded in the chart'
  } else {
    final_endo = 'Endo: Last measured GRBS was at ' + (time).toFixed(0) + ':00 Hrs and was ' + glucose + '. '
  }
  
  //HEME
  var h_interp = Interpret(heme);
  var final_heme = 'Heme: ' + getString(heme, h_interp);
  
  //PROPHYLAXIS
  var dvt_yn = activesheet.getRange('I29').getValue(); var dvt_mod = activesheet.getRange('K29').getValue();
  var final_proph;
  if (dvt_yn == 'Yes') {
    final_proph = 'VTE Prophylaxis with ' + dvt_mod + '. '
  } else {
    final_proph = 'Not on VTE Prophylaxis, out of bed as tolerated. Start on prophylaxis if not out of bed by tomorrow'
  }
  
  var stringArray = []; stringArray.push(final_cvs, cns_string, final_ren, final_resp, final_gi, final_id, final_endo, final_heme, final_proph);
  return stringArray;
  
}

function getVariables(activesheet) {
  
  var lab1a, lab1b, lab1c, vit1a, vit1b, dxrange, patrange, drugrange;
  var name, age, date, gender, hospital, md, day, linkText, hist; var surg, dx, spdx, apache, saps, dcdisp;
  var dev, gcs, sbp, temperature, map, spo2, hr, rr, fio2, pao2, paco2, ph, Aa, hco3, K, Na, Cl, Sbicarb, glucose, SCr, Hb, tlc, Plt, uo, net, f_status,
      BUr, Bili, DBili, inr, pt, lac, ast, alt, alp, alb;
  
  lab1a = activesheet.getRange("B22:C30").getValues(); 
  lab1b = activesheet.getRange("D22:E30").getValues();
  lab1c = activesheet.getRange("F24:G31").getValues();
  vit1a = activesheet.getRange("B12:C19").getValues();
  vit1b = activesheet.getRange("D12:E17").getValues();
  patrange = activesheet.getRange('B2:K4').getValues();
  dxrange = activesheet.getRange('B6:K8').getValues();
  
  var hr = ['Heart rate'], spo2 = ['Saturation'], map = ['MAP'], sbp = ['SBP'], temperature = ['Temp'], rr = ['RR']; 
  
  for (itr = 28; itr >=4; itr--) {
    if (activesheet.getRange('M'+itr).getValue() != "") {
      hr.push(activesheet.getRange('M'+itr).getValue());
      spo2.push(activesheet.getRange('N'+itr).getValue());
      map.push(activesheet.getRange('O'+itr).getValue());
      sbp.push(activesheet.getRange('P'+itr).getValue());
      temperature.push(activesheet.getRange('R'+itr).getValue());
      rr.push(activesheet.getRange('S'+itr).getValue());
      break; 
    } 
  }
  
  hospital = patrange[0][0]; md = patrange[0][8]; 
  gender = patrange[2][0]; age = patrange[2][3]; day = patrange[2][9];
  
  hist = activesheet.getRange("B6").getValue();
  
  surg = dxrange[0][7]; dx = dxrange[0][8]; spdx = dxrange[0][9];
  apache = dxrange[1][8]; saps = dxrange[1][9];
  
  uo = vit1a[4]; fio2 = vit1b[4];
  net = vit1a[7][1]; dev = vit1b[5][1]; f_status = activesheet.getRange('D19').getValue();
  if (fio2[1] <=1){
    fio2[1] = fio2[1]*100
  } 
  if (spo2[1] <=1){
    spo2[1] = spo2[1]*100
  } 
  
  Na = lab1a[0]; ph = lab1b[0];
  K = lab1a[1]; paco2 = lab1b[1];
  Cl = lab1a[2]; pao2 = lab1b[2]; Bili = lab1c[0];
  Sbicarb = lab1a[3]; hco3 = lab1b[3]; DBili = lab1c[1];
  glucose = lab1a[4]; lac = lab1b[4]; ast = lab1c[2];
  BUr = lab1a[5];/*//////////////*/ alt = lab1c[3];
  SCr = lab1a[6];/*//////////////*/ alp = lab1c[4];
  tlc = lab1a[7];/*//////////////*/ alb = lab1c[5];
  Hb = lab1a[8]; Plt = lab1b[8]; inr = lab1c[6]; pt = lab1c[7]
  
  var cvs = [hr, map], neph = [], resp = [], gi = [], patdetails = [], heme = []; 
  neph.push(Na, K, BUr, SCr, Cl, Sbicarb, uo, net, f_status);
  resp.push(spo2, rr, fio2, ph, paco2, pao2, hco3, lac, dev); 
  gi.push(Bili, DBili, ast, alt, alp, alb, pt, inr); 
  patdetails.push(hospital, md, gender, age, day, hist, surg, dx, spdx, apache, saps);
  heme.push(tlc, Hb, Plt);
  
  var variables = []; 
  variables.push(cvs);
  variables.push(neph);
  variables.push(resp);
  variables.push(gi);
  variables.push(patdetails);
  variables.push(heme);
  return variables;
  
}

function getRespString(resp, r_interp) {
  
  var abg = [], abgReview, spo2 = resp[0], fio2 = resp[2], dev = resp[8], lac = resp[7];
  abg.push(r_interp[3], r_interp[4], r_interp[5], r_interp[6]); 
  var resp_string1, resp_string2, resp_string3, final_resp;
  
  if (dev == 'ETT') {
    resp_string2 = 'Patient intubated. ' + 'Saturating ' + spo2[1] + '% on ' + fio2[1] + '% Oxygen' + '. '
  } else {
    resp_string2 = 'Saturating ' + spo2[1] + '% on ' + (fio2[1]).toFixed(0) + '% Oxygen using a ' + dev + '. ' 
  } 
  
  abgReview = isNormal(abg);
  if (r_interp[3]=='low') {
    if (r_interp[4]=='high'&& (r_interp[6]=='high' | r_interp[6]=='normal')) {
      resp_string1 = 'ABG suggestive of respiratory acidosis. '
    } else if ((r_interp[4]=='low' | r_interp[4]=='normal')&&r_interp[6]=='low') {
      resp_string1 = 'ABG suggestive of metabolic acidosis. '
    } else {
      resp_string1 = (r_interp[3] + ' ' + resp[3] + ', ' + r_interp[4] + ' ' + resp[4] + ', ' + r_interp[6] + ' ' + resp[6])
    }
  } else if (r_interp[3]=='high') {
    if (r_interp[4]=='high'&&(r_interp[6]=='high' | r_interp[6]=='normal')) {
      resp_string1 = 'ABG suggestive of metabolic alkalosis. '
    } else if ((r_interp[4]=='low' | r_interp[4]=='normal')&&r_interp[6]=='low') {
      resp_string1 = 'ABG suggestive of respiratory alkalosis. '
    } else {
      resp_string1 = (r_interp[3] + ' ' + resp[3] + ', ' + r_interp[4] + ' ' + resp[4] + ', ' + r_interp[6] + ' ' + resp[6])
    }
  } else if (abgReview == 4) {
    resp_string1 = 'ABG reviewed, normal. '
  } else if (abgReview<1 && abgReview >0) {
    resp_string1 = ''
  } else {
    resp_string1 = (r_interp[3] + ' ' + resp[3] + ', ' + r_interp[4] + ' ' + resp[4] + ', ' + r_interp[6] + ' ' + resp[6]) + '.'
  }
  
  if (r_interp[7] == 'high') {
    resp_string3 = 'Lactic acidosis with lactate of ' + lac[1] + '. '
  } else if (r_interp[7] == 'normal'){
    resp_string3 = 'Normal lactate. '
  } else {
    resp_string3 = ''
  }
  
  final_resp = resp_string2 + resp_string1 + resp_string3; 
  return final_resp;
}

function getGIString(gi, g_interp, activesheet) {
  
  var Bili = gi[0], DBili = gi[1], rate, npo; 
  var gi_string1, gi_string2, gi_string3, gi_string4, gi_string5, final_gi;
  
  npo = activesheet.getRange('I27').getValue(); rate = activesheet.getRange('I28').getValue();
  switch (npo) {
    case 'PO':
      gi_string1 = 'Feeding PO. ';
      break;
    case 'NPO':
      gi_string1 = 'Currently NPO. ';
      break;
    case 'NG/OG':
      gi_string1 = 'NGT/OGT insitu. ';
      break;
    case 'Parenteral':
      gi_string1 = 'Parenteral nutrition. ';
      break;
    case 'TPN':
      gi_string1 = 'Parenteral nutrition. ';
      break;
  }
  
  if (rate == null | rate == '') {
    gi_string2 = ''
  } else {
    gi_string2 = 'Feeding at a rate of ' + rate + '. '
  }
  
  if (g_interp[0] == 'high') {
    if ((DBili[1]/Bili[1])>0.2) {
      gi_string3 = 'Direct hyperbilirubinemia (' + Bili[1] + '). '
    } else {
      gi_string3 = 'Indirect hyperbilirubinemia (' + Bili[1] + '). '
    }
  } else {
    gi_string3 = ''
  } 
  
  if (isNormal(g_interp.slice(2,5)) == 3) {
    gi_string4 = 'LFTs reviewed, normal'
  } else if (isNormal(g_interp.slice(2,5))<1 && isNormal(g_interp.slice(2,5))>0) {
    gi_string4 = ''
  } else {
    gi_string4 = getString(gi.slice(2,5), g_interp.slice(2,5))
  } 
  
  gi_string5 = getString(gi.slice(5, 7), g_interp.slice(5, 7))
  
  final_gi = 'GI: ' + gi_string1 + gi_string2 + gi_string3 + gi_string4 + gi_string5 + '.'  
  if (gi_string1 == '' && gi_string2 == '' && gi_string3 == '') {
    final_gi = ''
  }
  return final_gi;
  
}

//--------------------MENU------------------------
/*
function runatOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('NoteGen')
  .addItem('Populate', 'NoteGen')
  .addToUi();
}
*/



