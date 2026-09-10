import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, LanguageMeta } from '../types';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'hi', name: 'हिन्दी', englishName: 'Hindi', speechCode: 'hi-IN' },
  { code: 'en', name: 'English', englishName: 'English', speechCode: 'en-US' },
  { code: 'mr', name: 'मराठी', englishName: 'Marathi', speechCode: 'mr-IN' },
  { code: 'kn', name: 'ಕನ್ನಡ', englishName: 'Kannada', speechCode: 'kn-IN' },
  { code: 'te', name: 'తెలుగు', englishName: 'Telugu', speechCode: 'te-IN' },
  { code: 'gu', name: 'ગુજરાતી', englishName: 'Gujarati', speechCode: 'gu-IN' },
];

export interface Translations {
  nav: {
    home: string;
    leafDoctor: string;
    cropAdvisor: string;
    mandiWeather: string;
    askKisanAI: string;
    schemes: string;
    vault: string;
    freeBadge: string;
    checkLeaf: string;
    homeBtn: string;
    voiceReadout: string;
    signIn: string;
    signOut: string;
    kisanCallCenter: string;
  };
  hero: {
    tickerAccurate: string;
    tickerDiseases: string;
    tickerMandi: string;
    tickerHelpline: string;
    badge: string;
    headline1: string;
    headline2: string;
    headline3?: string;
    description: string;
    btnDiagnose: string;
    btnCropML: string;
    stat1Val: string;
    stat1Lbl: string;
    stat2Val: string;
    stat2Lbl: string;
    stat3Val: string;
    stat3Lbl: string;
    hudCrop: string;
    hudAction: string;
    hudConfidence: string;
    hudStatus: string;
  };
  pipeline: {
    badge: string;
    heading: string;
    subheading: string;
    c1Title: string;
    c1Desc: string;
    c2Title: string;
    c2Desc: string;
    c3Title: string;
    c3Desc: string;
    c4Title: string;
    c4Desc: string;
    guideTitle: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
  };
  scanner: {
    badge: string;
    heading: string;
    subheading: string;
    samplePrompt: string;
    sampleTomato: string;
    sampleRice: string;
    samplePotato: string;
    sampleSoybean: string;
    dragDropText: string;
    cameraBtn: string;
    uploadBtn: string;
    analyzing: string;
    resultsTitle: string;
    confidenceLabel: string;
    foliarDamage: string;
    severityLabel: string;
    organicTitle: string;
    chemicalTitle: string;
    listenAloud: string;
    stopAudio: string;
    fieldNameLabel: string;
    fieldNamePlaceholder: string;
    saveToVault: string;
    savedSuccess: string;
    saving: string;
    shareReport: string;
    criticalBadge: string;
    warningBadge: string;
    healthyBadge: string;
  };
  cropML: {
    badge: string;
    heading: string;
    subheading: string;
    presetsLabel: string;
    presetPunjab: string;
    presetKarnataka: string;
    presetBengal: string;
    presetGujarat: string;
    nitrogen: string;
    phosphorus: string;
    potassium: string;
    ph: string;
    temperature: string;
    humidity: string;
    rainfall: string;
    predictBtn: string;
    calculating: string;
    resultTitle: string;
    yieldPotential: string;
    mspRate: string;
    waterDemand: string;
    netMargin: string;
    altCrop: string;
    rationale: string;
    askAI: string;
  };
  telemetry: {
    badge: string;
    heading: string;
    subheading: string;
    mandiTableTitle: string;
    colCommodity: string;
    colVariety: string;
    colMandi: string;
    colState: string;
    colPrice: string;
    colTrend: string;
    sporeTitle: string;
    sporeBadge: string;
    riskIndex: string;
    sporeWarning: string;
    sporeRemedy: string;
    soilHealthTitle: string;
    liveTelemetry: string;
    rootMoisture: string;
    goodMoisture: string;
    rootDepthDesc: string;
    saltLevel: string;
    normalFertility: string;
    saltDesc: string;
    bedTemp: string;
    idealRoots: string;
    tempDesc: string;
    sunlight: string;
    goodSun: string;
    sunDesc: string;
  };
  schemes: {
    badge: string;
    heading: string;
    subheading: string;
    pmKisanTitle: string;
    pmKisanDesc: string;
    pmfbyTitle: string;
    pmfbyDesc: string;
    shcTitle: string;
    shcDesc: string;
    kccTitle: string;
    kccDesc: string;
    helplineTitle: string;
    helplineNumber: string;
    helplineDesc: string;
    viewPortal: string;
    callNow: string;
  };
  vault: {
    badge: string;
    heading: string;
    subheading: string;
    totalScans: string;
    activeFields: string;
    criticalCases: string;
    soilPlans: string;
    filterAll: string;
    filterCritical: string;
    filterHealthy: string;
    noRecords: string;
    noRecordsDesc: string;
    printExport: string;
    scanNew: string;
  };
  chatbot: {
    botLanguageLabel: string;
    badge: string;
    title: string;
    subtitle: string;
    welcome: string;
    inputPlaceholder: string;
    listening: string;
    speakBtn: string;
    stopSpeech: string;
    send: string;
    quickPrompt1: string;
    quickPrompt2: string;
    quickPrompt3: string;
    quickPrompt4: string;
    kccHelplinePrompt: string;
  };
  footer: {
    aboutTitle: string;
    aboutDesc: string;
    quickLinks: string;
    schemesLink: string;
    scannerLink: string;
    advisorLink: string;
    helplineTitle: string;
    helplineDesc: string;
    copyright: string;
  };
  auth: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    nameLabel: string;
    signInBtn: string;
    signUpBtn: string;
    googleBtn: string;
    or: string;
    toggleSignUp: string;
    toggleSignIn: string;
  };
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  // 1. HINDI
  hi: {
    nav: {
      home: 'होम',
      leafDoctor: 'पत्ती डॉक्टर',
      cropAdvisor: 'फसल सलाहकार',
      mandiWeather: 'मंडी व मौसम',
      askKisanAI: 'किसान AI से पूछें',
      schemes: 'सरकारी योजनाएं व मदद',
      vault: 'मेरी खेत डायरी',
      freeBadge: '🌾 किसानों के लिए 100% मुफ्त',
      checkLeaf: 'पत्ती जांचें',
      homeBtn: 'होम',
      voiceReadout: 'आवाज',
      signIn: 'लॉग इन',
      signOut: 'बाहर निकलें',
      kisanCallCenter: 'किसान हेल्पलाइन 1800-180-1551',
    },
    hero: {
      tickerAccurate: '98.4% सटीक पैथोलॉजी विज़न',
      tickerDiseases: '38+ फसल बीमारियां पहचानी जाती हैं',
      tickerMandi: 'लाइव APMC मंडी भाव',
      tickerHelpline: 'किसान कॉल सेंटर 1800-180-1551 (24x7)',
      badge: 'स्मार्ट फसल रक्षक • किसान साथी',
      headline1: 'फसल की करें रक्षा।',
      headline2: 'बढ़ाएं अपनी पैदावार।',
      headline3: '',
      description: 'पत्ती की तस्वीर खींचकर 3 सेकंड में फसल बीमारी की पहचान करें, मिट्टी NPK जांच से अधिक मुनाफे वाली फसल चुनें, और मंडियों के ताज़ा भाव जानें।',
      btnDiagnose: 'पत्ती का रोग जांचें',
      btnCropML: 'AI से सबसे अच्छी फसल जानें',
      stat1Val: '38+',
      stat1Lbl: 'फसल बीमारियां पहचानें',
      stat2Val: '98.4%',
      stat2Lbl: 'सटीक नैदानिक दर',
      stat3Val: '6 भाषाएं',
      stat3Lbl: 'अपनी मातृभाषा में बोलकर सुनें',
      hudCrop: 'टमाटर अगेती झुलसा',
      hudAction: '2 ग्राम मैन्कोजेब प्रति लीटर पानी का छिड़काव करें',
      hudConfidence: '98.4% विश्वसनीयता',
      hudStatus: 'तत्काल उपचार जरूरी',
    },
    pipeline: {
      badge: 'गंभीर कृषि चुनौतियाँ',
      heading: 'रोग की समय पर पहचान क्यों जरूरी है?',
      subheading: 'रोग की देर से पहचान होने से भारतीय किसानों की 40% तक फसल बर्बाद हो जाती है।',
      c1Title: 'अनिश्चित मौसम',
      c1Desc: 'अचानक बारिश और अधिक नमी के कारण रातों-रात फफूंद और जीवाणु फैल जाते हैं।',
      c2Title: 'रोग की देर से पहचान',
      c2Desc: 'लक्षण जब तक आंखों से दिखते हैं, तब तक फसल का बड़ा हिस्सा खराब हो चुका होता है।',
      c3Title: 'दवाइयों का भारी खर्च',
      c3Desc: 'बिना सही जानकारी के महंगी दवाइयां छिड़कने से खर्च और कर्ज दोनों बढ़ते हैं।',
      c4Title: 'भाषा की रुकावट',
      c4Desc: 'वैज्ञानिक सलाह अक्सर कठिन अंग्रेजी में होती है और स्थानीय भाषा में नहीं मिलती।',
      guideTitle: 'कृषि रक्षक कैसे काम करता है (4 आसान चरण)',
      step1Title: '1. पत्ती की फोटो लें',
      step1Desc: 'अपने मोबाइल कैमरे से बीमार पत्ती की साफ फोटो लें या गैलरी से अपलोड करें।',
      step2Title: '2. तुरंत AI से रोग पहचानें',
      step2Desc: 'आर्टिफिशियल इंटेलिजेंस पत्ती की बीमारी, फफूंद का असर और गंभीरता तुरंत बताता है।',
      step3Title: '3. दवा और सही मात्रा जानें',
      step3Desc: 'सस्ती जैविक दवाइयां (नीम अर्क) व प्रमाणित रसायनों की सही मात्रा (ग्राम/लीटर) पाएं।',
      step4Title: '4. अपनी भाषा में आवाज सुनें',
      step4Desc: 'सलाह को अपनी भाषा — हिंदी, मराठी, कन्नड़, तेलुगु, गुजराती या अंग्रेजी में सुनें।',
    },
    scanner: {
      badge: 'AI पत्ती डॉक्टर',
      heading: 'फसल रोग पहचान व उपचार केंद्र',
      subheading: 'किसी भी फसल की पत्ती की फोटो अपलोड करें और तुरंत सटीक बीमारी व दवा की जानकारी पाएं।',
      samplePrompt: 'या उदाहरण फसलें चुनकर देखें:',
      sampleTomato: 'टमाटर झुलसा',
      sampleRice: 'धान ब्लास्ट',
      samplePotato: 'आलू पछेती झुलसा',
      sampleSoybean: 'स्वस्थ सोयाबीन',
      dragDropText: 'पत्ती की फोटो यहां खींचें या गैलरी से चुनने के लिए क्लिक करें',
      cameraBtn: 'कैमरे से फोटो लें',
      uploadBtn: 'फोटो अपलोड करें',
      analyzing: 'AI पत्ती की बीमारी की जांच कर रहा है...',
      resultsTitle: 'जांच परिणाम व उपचार सलाह',
      confidenceLabel: 'सटीकता',
      foliarDamage: 'पत्ती का प्रभावित हिस्सा',
      severityLabel: 'गंभीरता की स्थिति',
      organicTitle: '🌿 जैविक व प्राकृतिक उपचार',
      chemicalTitle: '🧪 प्रमाणित रासायनिक दवा व सही मात्रा',
      listenAloud: 'सलाह आवाज में सुनें',
      stopAudio: 'आवाज रोकें',
      fieldNameLabel: 'खेत / प्लॉट का नाम दर्ज करें',
      fieldNamePlaceholder: 'उदा. उत्तर वाला खेत #2',
      saveToVault: 'खेत डायरी में सुरक्षित करें',
      savedSuccess: 'खेत डायरी में सहेज लिया गया!',
      saving: 'सहेज रहे हैं...',
      shareReport: 'जांच रिपोर्ट शेयर करें',
      criticalBadge: 'गंभीर संक्रमण',
      warningBadge: 'सतर्कता आवश्यक',
      healthyBadge: 'पूर्णतः स्वस्थ',
    },
    cropML: {
      badge: 'कृषि ML सिफारिश इंजन',
      heading: 'मिट्टी जांच व सर्वाधिक मुनाफे वाली फसल',
      subheading: 'अपनी मिट्टी के NPK, pH और मौसम के आंकड़े डालकर अपने खेत के लिए सबसे फायदेमंद फसल जानें।',
      presetsLabel: 'क्षेत्र अनुसार मिट्टी के आंकड़े चुनें:',
      presetPunjab: 'पंजाब (गेहूं क्षेत्र)',
      presetKarnataka: 'कर्नाटक (रबी फसल)',
      presetBengal: 'बंगाल (धान डेल्टा)',
      presetGujarat: 'गुजरात (काली मिट्टी)',
      nitrogen: 'नाइट्रोजन (N) किग्रा/हेक्टेयर',
      phosphorus: 'फास्फोरस (P) किग्रा/हेक्टेयर',
      potassium: 'पोटाश (K) किग्रा/हेक्टेयर',
      ph: 'मिट्टी का pH मान',
      temperature: 'तापमान (°C)',
      humidity: 'नमी / आर्द्रता (%)',
      rainfall: 'मौसमी बारिश (मिमी)',
      predictBtn: 'सर्वाधिक लाभकारी फसल जानें',
      calculating: 'मिट्टी विश्लेषण जारी है...',
      resultTitle: 'अनुशंसित फसल व उत्पादन विवरण',
      yieldPotential: 'अपेक्षित पैदावार',
      mspRate: 'सरकारी समर्थन मूल्य (MSP)',
      waterDemand: 'पानी की आवश्यकता',
      netMargin: 'अनुमानित शुद्ध मुनाफा',
      altCrop: 'वैकल्पिक फसल का विकल्प',
      rationale: 'वैज्ञानिक कारण',
      askAI: 'किसान AI से इस फसल की बुवाई विधि पूछें',
    },
    telemetry: {
      badge: 'लाइव कृषि टेलीमेट्री',
      heading: 'APMC मंडी भाव व सूक्ष्म-जलवायु अलर्ट',
      subheading: 'देश की प्रमुख मंडियों के ताज़ा भाव और खेत में फफूंद व रोग फैलने का पूर्वानुमान।',
      mandiTableTitle: 'आज के प्रमुख APMC मंडी भाव',
      colCommodity: 'फसल / जिंस',
      colVariety: 'किस्म',
      colMandi: 'मंडी',
      colState: 'राज्य',
      colPrice: 'मॉडल भाव (₹/क्विंटल)',
      colTrend: '24 घंटे का रुझान',
      sporeTitle: 'फफूंद रोग व बीजाणु अलर्ट',
      sporeBadge: 'अधिक नमी की चेतावनी',
      riskIndex: 'रोग जोखिम सूचकांक',
      sporeWarning: 'लगातार सुबह के कोहरे और 14 घंटे से अधिक पत्ती गीली रहने के कारण झुलसा और रतुआ रोग फैलने का खतरा अधिक है।',
      sporeRemedy: 'अगली बारिश से पहले एहतियातन नीम का तेल या कॉपर फंगीसाइड का छिड़काव करें।',
      soilHealthTitle: 'मिट्टी की नमी व खेत की स्थिति',
      liveTelemetry: 'लाइव खेत टेलीमेट्री',
      rootMoisture: 'जड़ क्षेत्र की नमी',
      goodMoisture: 'संतोषजनक नमी',
      rootDepthDesc: 'जड़ की गहराई: 15 सेमी • अभी पानी देने की आवश्यकता नहीं',
      saltLevel: 'मिट्टी में लवण / उर्वरक स्तर',
      normalFertility: 'सामान्य उर्वरकता',
      saltDesc: 'संतुलित रासायनिक लवण, जड़ों के विकास के लिए सुरक्षित',
      bedTemp: 'मिट्टी की क्यारी का तापमान',
      idealRoots: 'जड़ों के लिए उत्तम',
      tempDesc: 'केंचुओं और लाभकारी सूक्ष्मजीवों के लिए अनुकूल',
      sunlight: 'धूप व दिन के घंटे',
      goodSun: 'पर्याप्त धूप',
      sunDesc: 'प्रकाश संश्लेषण के लिए पर्याप्त धूप उपलब्ध',
    },
    schemes: {
      badge: 'सरकारी किसान सहायता',
      heading: 'प्रमुख सरकारी योजनाएं व 24x7 हेल्पलाइन',
      subheading: 'किसानों के लिए सरकारी सब्सिडी, फसल बीमा और शून्य-ब्याज ऋण की संपूर्ण जानकारी।',
      pmKisanTitle: 'पीएम-किसान सम्मान निधि',
      pmKisanDesc: 'पात्र किसान परिवारों को हर साल ₹6,000 की वित्तीय सहायता (3 बराबर किश्तों में) सीधे बैंक खाते में।',
      pmfbyTitle: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
      pmfbyDesc: 'बुवाई से लेकर कटाई तक प्राकृतिक आपदाओं, ओलावृष्टि और सूखे से होने वाले नुकसान का संपूर्ण बीमा सुरक्षा।',
      shcTitle: 'मृदा स्वास्थ्य कार्ड योजना (Soil Health Card)',
      shcDesc: 'हर 2 साल में खेत की मिट्टी की मुफ्त जांच, जिससे खाद और उर्वरक का संतुलित व किफायती उपयोग हो सके।',
      kccTitle: 'किसान क्रेडिट कार्ड (KCC)',
      kccDesc: 'खेती के लिए 4% की रियायती ब्याज दर पर आसान ऋण और ₹1.6 लाख तक बिना बंधक (कोलैटरल-फ्री) लोन।',
      helplineTitle: 'किसान कॉल सेंटर (टोल फ्री 24x7)',
      helplineNumber: '1800-180-1551',
      helplineDesc: '22 क्षेत्रीय भाषाओं में कृषि वैज्ञानिकों से फोन पर निशुल्क सलाह, सुबह 6:00 बजे से रात 10:00 बजे तक।',
      viewPortal: 'आधिकारिक पोर्टल खोलें',
      callNow: 'तुरंत कॉल करें',
    },
    vault: {
      badge: 'खेत डायरी व क्लाउड रिकॉर्ड',
      heading: 'मेरे खेत की जांच व इतिहास',
      subheading: 'पिछले सभी पत्ती जांच रिकॉर्ड, दवाओं का छिड़काव और मिट्टी की योजनाएं सुरक्षित रखें।',
      totalScans: 'कुल जांच',
      activeFields: 'सक्रिय खेत / प्लॉट',
      criticalCases: 'गंभीर रोग मामले',
      soilPlans: 'फसल योजनाएं',
      filterAll: 'सभी रिकॉर्ड',
      filterCritical: 'गंभीर समस्याएं',
      filterHealthy: 'स्वस्थ फसलें',
      noRecords: 'कोई सहेजा गया रिकॉर्ड नहीं मिला',
      noRecordsDesc: 'पत्ती की जांच करें या मिट्टी की योजना बनाकर अपनी खेत डायरी में जोड़ें।',
      printExport: 'रिपोर्ट प्रिंट / पीडीएफ डाउनलोड करें',
      scanNew: 'नई पत्ती की जांच करें',
    },
    chatbot: {
      botLanguageLabel: 'चैटबॉट की बोलने व सुनने की भाषा:',
      badge: 'मातृभाषा किसान AI सहायक',
      title: 'किसान AI सहायक',
      subtitle: 'अपनी मातृभाषा में बोलकर या लिखकर कृषि प्रश्न पूछें',
      welcome: 'नमस्ते किसान भाई! मैं आपका कृषि रक्षक साथी हूँ। अपनी भाषा में कोई भी कृषि सवाल पूछें — पत्ती रोग की दवा, जैविक कीटनाशक, बुवाई का समय या आज के मंडी भाव।',
      inputPlaceholder: 'अपना सवाल यहाँ लिखें या माइक दबाकर बोलें...',
      listening: 'सुन रहा हूँ... बोलिए...',
      speakBtn: 'आवाज में सुनें',
      stopSpeech: 'आवाज बंद करें',
      send: 'भेजें',
      quickPrompt1: 'यूरिया की एक बोरी की जगह क्या इस्तेमाल करें?',
      quickPrompt2: 'कर्नाटक में चने की बुवाई का सबसे सही समय क्या है?',
      quickPrompt3: 'आज नासिक मंडी में प्याज का क्या भाव है?',
      quickPrompt4: 'टमाटर के अगेती झुलसा के लिए मैन्कोजेब की कितनी मात्रा डालें?',
      kccHelplinePrompt: 'किसान कॉल सेंटर हेल्पलाइन नंबर क्या है?',
    },
    footer: {
      aboutTitle: 'कृषि रक्षक के बारे में',
      aboutDesc: 'कृषि रक्षक भारतीय किसानों के लिए एक 100% मुफ्त, आधुनिक AI कृषि सहायक है जो पत्तियों की बीमारी की जांच, मिट्टी अनुसार फसल सलाह और मंडी भाव तुरंत उपलब्ध कराता है।',
      quickLinks: 'त्वरित लिंक',
      schemesLink: 'सरकारी योजनाएं व मदद',
      scannerLink: 'पत्ती डॉक्टर (रोग जांच)',
      advisorLink: 'मिट्टी अनुसार फसल चयन',
      helplineTitle: 'आपातकालीन किसान हेल्पलाइन',
      helplineDesc: 'टोल फ्री 1800-180-1551 (किसान कॉल सेंटर, कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार)',
      copyright: 'भारतीय किसानों के सम्मान में समर्पित • जय जवान, जय किसान 🌾',
    },
    auth: {
      title: 'किसान खाता लॉग इन करें',
      subtitle: 'अपने खेत के रिकॉर्ड और जांच इतिहास को हमेशा सुरक्षित रखने के लिए लॉग इन करें।',
      emailLabel: 'ईमेल पता',
      passwordLabel: 'पासवर्ड',
      nameLabel: 'किसान का पूरा नाम',
      signInBtn: 'लॉग इन करें',
      signUpBtn: 'नया खाता बनाएं',
      googleBtn: 'गूगल से तुरंत जुड़ें',
      or: 'या',
      toggleSignUp: 'खाता नहीं है? नया खाता बनाएं',
      toggleSignIn: 'पहले से खाता है? लॉग इन करें',
    },
  },

  // 2. ENGLISH
  en: {
    nav: {
      home: 'Home',
      leafDoctor: 'Leaf Doctor',
      cropAdvisor: 'Crop Advisor',
      mandiWeather: 'Mandi & Weather',
      askKisanAI: 'Ask Kisan AI',
      schemes: 'Farmer Schemes & Help',
      vault: 'My Farm Notebook',
      freeBadge: '🌾 100% Free for Farmers',
      checkLeaf: 'Check Leaf',
      homeBtn: 'Home',
      voiceReadout: 'Voice',
      signIn: 'Sign In',
      signOut: 'Sign Out',
      kisanCallCenter: 'Kisan Helpline 1800-180-1551',
    },
    hero: {
      tickerAccurate: '98.4% Accurate Pathology Vision',
      tickerDiseases: '38+ Crop Diseases Identified',
      tickerMandi: 'Live APMC Mandi Rates',
      tickerHelpline: 'Kisan Call Center 1800-180-1551 (24x7)',
      badge: 'SMART CROP DOCTOR • KISAN COMPANION',
      headline1: 'Protect Your Crops.',
      headline2: 'Increase Your Harvest.',
      headline3: '',
      description: 'Snap a leaf photo to diagnose crop diseases in 3 seconds with AI remedies, predict highest-profit crops with soil NPK, and check real-time Mandi market rates.',
      btnDiagnose: 'Diagnose Leaf Disease',
      btnCropML: 'Find Best Crop with AI',
      stat1Val: '38+',
      stat1Lbl: 'Crop Diseases Detected',
      stat2Val: '98.4%',
      stat2Lbl: 'Diagnostic Accuracy',
      stat3Val: '6 Languages',
      stat3Lbl: 'Vernacular Voice Support',
      hudCrop: 'Tomato Early Blight',
      hudAction: 'Spray Mancozeb 75 WP @ 2.0g/L water',
      hudConfidence: '98.4% Confidence',
      hudStatus: 'Immediate Action Required',
    },
    pipeline: {
      badge: 'CRITICAL FARM CHALLENGES',
      heading: 'Why Early Precision Agriculture Matters',
      subheading: 'Traditional delays in crop disease identification cause up to 40% harvest loss in Indian agriculture.',
      c1Title: 'Unpredictable Weather',
      c1Desc: 'Sudden unseasonal rains and humidity spikes trigger devastating fungal spores overnight.',
      c2Title: 'Late Disease Detection',
      c2Desc: 'Visual symptoms go unnoticed until leaf necrosis spreads across the entire field.',
      c3Title: 'Excessive Chemical Costs',
      c3Desc: 'Spraying incorrect high-cost fungicides without diagnosis increases debt burden.',
      c4Title: 'Vernacular Barriers',
      c4Desc: 'Scientific agronomic recommendations often aren\'t available in local spoken mother tongues.',
      guideTitle: 'How KrishiRakshak Works in 4 Steps',
      step1Title: '1. Take Leaf Photo',
      step1Desc: 'Take a clear photo with your phone camera or upload a saved picture of affected foliage.',
      step2Title: '2. Instant AI Diagnosis',
      step2Desc: 'Computer vision detects pathogens, foliar lesion percentage, and pathogen severity.',
      step3Title: '3. Prescribed Cures',
      step3Desc: 'Receive exact low-cost organic remedies and certified chemical sprays with dosage.',
      step4Title: '4. Listen Spoken Aloud',
      step4Desc: 'Listen to the advisory spoken in your mother tongue with clean audio playback.',
    },
    scanner: {
      badge: 'AI LEAF DOCTOR',
      heading: 'Leaf Pathology & Disease Diagnostic',
      subheading: 'Upload or snap a photo of any crop leaf to detect bacterial, fungal, or viral infections immediately.',
      samplePrompt: 'Or test with sample crops:',
      sampleTomato: 'Tomato Blight',
      sampleRice: 'Rice Blast',
      samplePotato: 'Potato Late Blight',
      sampleSoybean: 'Healthy Soybean',
      dragDropText: 'Drag & Drop leaf photo here or click to browse files',
      cameraBtn: 'Take Camera Photo',
      uploadBtn: 'Upload Leaf Image',
      analyzing: 'Analyzing cellular leaf pathology with AI...',
      resultsTitle: 'Diagnostic Summary & Pathology Report',
      confidenceLabel: 'Confidence',
      foliarDamage: 'Foliar Damage Area',
      severityLabel: 'Severity Status',
      organicTitle: '🌿 Organic & Natural Remedies',
      chemicalTitle: '🧪 Certified Chemical Spray & Dosage',
      listenAloud: 'Listen Spoken Advice',
      stopAudio: 'Stop Voice',
      fieldNameLabel: 'Field / Plot Name',
      fieldNamePlaceholder: 'e.g. North Acre #2',
      saveToVault: 'Save to My Farm Notebook',
      savedSuccess: 'Saved to Farm Notebook!',
      saving: 'Saving...',
      shareReport: 'Share Diagnosis Report',
      criticalBadge: 'Critical Infection',
      warningBadge: 'Caution Required',
      healthyBadge: 'Optimal Health',
    },
    cropML: {
      badge: 'AGRONOMIC RECOMMENDATION ENGINE',
      heading: 'Soil Health & Maximum-Profit Crop ML',
      subheading: 'Enter your soil test values (NPK, pH) and weather conditions to identify the most lucrative crop.',
      presetsLabel: 'Quick Soil Presets by Region:',
      presetPunjab: 'Punjab (Wheat Belt)',
      presetKarnataka: 'Karnataka (Rabi)',
      presetBengal: 'Bengal (Delta Paddy)',
      presetGujarat: 'Gujarat (Black Soil)',
      nitrogen: 'Nitrogen (N) kg/ha',
      phosphorus: 'Phosphorus (P) kg/ha',
      potassium: 'Potassium (K) kg/ha',
      ph: 'Soil pH Level',
      temperature: 'Temperature (°C)',
      humidity: 'Humidity (%)',
      rainfall: 'Seasonal Rainfall (mm)',
      predictBtn: 'Predict Recommended Crop',
      calculating: 'Calculating Soil Recommendation...',
      resultTitle: 'Recommended Crop Formulation',
      yieldPotential: 'Expected Yield',
      mspRate: 'Govt MSP Rate',
      waterDemand: 'Water Requirement',
      netMargin: 'Estimated Net Margin',
      altCrop: 'Alternative Crop Option',
      rationale: 'Agronomic Rationale',
      askAI: 'Ask Kisan AI about growing this crop',
    },
    telemetry: {
      badge: 'LIVE FARM INTELLIGENCE',
      heading: 'APMC Mandi Rates & Micro-Climate Telemetry',
      subheading: 'Real-time crop market prices from major Indian mandis and field disease-risk monitoring.',
      mandiTableTitle: 'Today\'s APMC Mandi Market Prices',
      colCommodity: 'Commodity',
      colVariety: 'Variety',
      colMandi: 'Mandi / Market',
      colState: 'State',
      colPrice: 'Modal Rate (₹/qtl)',
      colTrend: '24h Trend',
      sporeTitle: 'Fungal Disease & Spore Alert',
      sporeBadge: 'High Humidity Alert',
      riskIndex: 'Disease Risk Index',
      sporeWarning: 'Continuous morning fog and leaf-wetness duration over 14 hours create high conditions for blight, rust, and leaf spot spread.',
      sporeRemedy: 'Spray preventative organic Neem oil or copper fungicide before next rainfall.',
      soilHealthTitle: 'Soil Moisture & Field Conditions',
      liveTelemetry: 'Live Field Telemetry',
      rootMoisture: 'Root Zone Moisture',
      goodMoisture: 'Good Moisture',
      rootDepthDesc: 'Root depth: 15cm • No immediate watering needed',
      saltLevel: 'Soil Salt / Fertilizer Level',
      normalFertility: 'Normal Fertility',
      saltDesc: 'Balanced chemical salts, safe for root growth',
      bedTemp: 'Soil Bed Temperature',
      idealRoots: 'Ideal for Roots',
      tempDesc: 'Good for beneficial earthworms and soil microbes',
      sunlight: 'Sunlight & Daylight Hours',
      goodSun: 'Good Sun',
      sunDesc: 'Adequate light for leaf photosynthesis',
    },
    schemes: {
      badge: 'GOVERNMENT FARMER SUPPORT',
      heading: 'Direct Farmer Welfare Schemes & Official Helplines',
      subheading: 'Government subsidies, crop insurance programs, and zero-interest credit facilities available for Indian farmers.',
      pmKisanTitle: 'PM-Kisan Samman Nidhi',
      pmKisanDesc: '₹6,000 annual direct income support transferred in 3 equal four-monthly installments to verified farmer families.',
      pmfbyTitle: 'PM Fasal Bima Yojana (PMFBY)',
      pmfbyDesc: 'Comprehensive insurance coverage against non-preventable natural risks from pre-sowing to post-harvest.',
      shcTitle: 'Soil Health Card Scheme',
      shcDesc: 'Periodic soil testing every 2 years informing farmers on nutrient deficiencies and fertilizer dosage.',
      kccTitle: 'Kisan Credit Card (KCC)',
      kccDesc: 'Concessional credit limit with interest subvention up to 3% for timely repayment, collateral-free up to ₹1.6 Lakh.',
      helplineTitle: 'Kisan Call Center (Toll Free 24x7)',
      helplineNumber: '1800-180-1551',
      helplineDesc: 'Toll-free telephone guidance by qualified agricultural scientists in 22 regional Indian languages, 6:00 AM to 10:00 PM.',
      viewPortal: 'Open Official Portal',
      callNow: 'Call Now',
    },
    vault: {
      badge: 'FARM NOTEBOOK & CLOUD VAULT',
      heading: 'My Crop Health & Diagnosis Records',
      subheading: 'Track previous disease inspections, treatment logs, and soil formulations over time.',
      totalScans: 'Total Scans',
      activeFields: 'Active Fields',
      criticalCases: 'Critical Blights',
      soilPlans: 'Soil Plans',
      filterAll: 'All Records',
      filterCritical: 'Urgent Issues',
      filterHealthy: 'Healthy Crops',
      noRecords: 'No farm records found',
      noRecordsDesc: 'Scan crop leaves or generate soil crop recommendations to start saving your farm history.',
      printExport: 'Print / Export PDF',
      scanNew: 'Scan a New Leaf',
    },
    chatbot: {
      botLanguageLabel: 'Chatbot Voice & Reply Language:',
      badge: 'VERNACULAR KISAN AI AGENT',
      title: 'Kisan AI Assistant',
      subtitle: 'Ask questions in your mother tongue with voice or text',
      welcome: 'Namaste Kisan Bhai! I am your KrishiRakshak farm companion. Ask me any farming question in your own language — leaf disease medicines, natural pest remedies, sowing advice, or today\'s Mandi market rates.',
      inputPlaceholder: 'Type your question or click the mic to speak...',
      listening: 'Listening... speak now...',
      speakBtn: 'Listen Spoken',
      stopSpeech: 'Stop Audio',
      send: 'Send',
      quickPrompt1: 'How to replace 1 bag of synthetic Urea?',
      quickPrompt2: 'Optimal Chickpea sowing window in Karnataka?',
      quickPrompt3: 'What is today\'s Nashik Mandi onion rate?',
      quickPrompt4: 'Mancozeb dosage for Tomato Early Blight?',
      kccHelplinePrompt: 'What is the Kisan Call Center toll-free helpline?',
    },
    footer: {
      aboutTitle: 'About KrishiRakshak',
      aboutDesc: 'KrishiRakshak is a free, precision AI agriculture assistant built for Indian smallholder farmers. Early disease diagnosis, soil ML recommendations, and live mandi intelligence.',
      quickLinks: 'Quick Links',
      schemesLink: 'Farmer Schemes & Help',
      scannerLink: 'Leaf Doctor (Disease Scan)',
      advisorLink: 'Crop Advisor (Soil ML)',
      helplineTitle: 'Emergency Farmer Helpline',
      helplineDesc: 'Toll-free 1800-180-1551 (Kisan Call Center, Ministry of Agriculture & Farmers Welfare, Govt. of India)',
      copyright: 'Built with pride for Indian Farmers • Jai Jawan, Jai Kisan 🌾',
    },
    auth: {
      title: 'Farmer Profile & Cloud Sync',
      subtitle: 'Sign in to automatically sync and access your farm records across all your devices.',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Farmer Full Name',
      signInBtn: 'Sign In',
      signUpBtn: 'Create Farmer Account',
      googleBtn: 'Continue with Google',
      or: 'OR',
      toggleSignUp: 'Don\'t have an account? Sign Up',
      toggleSignIn: 'Already have an account? Sign In',
    },
  },

  // 3. MARATHI (मराठी)
  mr: {
    nav: {
      home: 'मुख्य पृष्ठ',
      leafDoctor: 'पान डॉक्टर',
      cropAdvisor: 'पीक सल्लागार',
      mandiWeather: 'बाजार भाव व हवामान',
      askKisanAI: 'किसान AI ला विचारा',
      schemes: 'शेतकरी योजना व मदत',
      vault: 'माझी शेत नोंदवही',
      freeBadge: '🌾 शेतकऱ्यांसाठी १००% मोफत',
      checkLeaf: 'पान तपासा',
      homeBtn: 'मुख्य',
      voiceReadout: 'आवाज',
      signIn: 'साइन इन',
      signOut: 'बाहेर पडा',
      kisanCallCenter: 'किसान हेल्पलाइन १८००-१८०-१५५१',
    },
    hero: {
      tickerAccurate: '९८.४% अचूक पॅथॉलॉजी व्हिजन',
      tickerDiseases: '३८+ पिकांचे रोग ओळखण्याची क्षमता',
      tickerMandi: 'थेट कृषी उत्पन्न बाजार समिती भाव',
      tickerHelpline: 'किसान कॉल सेंटर १८००-१८०-१५५१ (२४x७)',
      badge: 'स्मार्ट पीक संरक्षक • शेतकरी साथी',
      headline1: 'पिकांचे करा रक्षण.',
      headline2: 'वाढवा भरघोस उत्पादन.',
      headline3: '',
      description: 'पानाचा फोटो काढून ३ सेकंदात पीक रोगाचे अचूक निदान मिळवा, माती परीक्षणावरून सर्वाधिक नफ्याचे पीक निवडा आणि थेट बाजार भाव तपासा.',
      btnDiagnose: 'पानावरील रोग तपासा',
      btnCropML: 'AI द्वारे सर्वोत्तम पीक निवडा',
      stat1Val: '३८+',
      stat1Lbl: 'पिकांचे रोग ओळखले जातात',
      stat2Val: '९८.४%',
      stat2Lbl: 'रोगनिदान अचूकता',
      stat3Val: '६ भाषा',
      stat3Lbl: 'आपल्या मातृभाषेत आवाज मार्गदर्शन',
      hudCrop: 'टोमॅटो लवकर येणारा करपा',
      hudAction: '२ ग्रॅम मॅन्कोझेब प्रति लिटर पाण्यात मिसळून फवारा',
      hudConfidence: '९८.४% अचूकता',
      hudStatus: 'तातडीने उपाय आवश्यक',
    },
    pipeline: {
      badge: 'शेतीसमोरील महत्त्वाची आव्हाने',
      heading: 'रोगाचे वेळेवर अचूक निदान का आवश्यक आहे?',
      subheading: 'रोगाचे वेळेवर निदान न झाल्यामुळे भारतीय शेतकऱ्यांचे दरवर्षी ४०% पर्यंत पिकांचे नुकसान होते.',
      c1Title: 'अनपेक्षित हवामान',
      c1Desc: 'अचानक होणारा पाऊस आणि वाढलेली हवेतील आर्द्रता यामुळे रातोरात बुरशीजन्य रोग पसरतात.',
      c2Title: 'रोगाचे उशिरा निदान',
      c2Desc: 'लक्षणे डोळ्यांनी दिसू लागतात तोपर्यंत पानांचा आणि पिकाचा मोठा भाग बाधित झालेला असतो.',
      c3Title: 'खतांचा आणि औषधांचा अतिरिक्त खर्च',
      c3Desc: 'योग्य मार्गदर्शनाशिवाय महागड्या औषधांची फवारणी केल्याने उत्पादन खर्च व कर्जाचा भार वाढतो.',
      c4Title: 'भाषेची अडचण',
      c4Desc: 'कृषी विद्यापीठांचा वैज्ञानिक सल्ला स्थानिक भाषेत वेळेवर न मिळाल्याने नुकसान होते.',
      guideTitle: 'कृषी रक्षक कसे कार्य करते (४ सोपे टप्पे)',
      step1Title: '१. पानाचा फोटो काढा',
      step1Desc: 'मोबाईल कॅमेऱ्याने बाधित पानाचा स्पष्ट फोटो काढा किंवा गॅलरीतून अपलोड करा.',
      step2Title: '२. AI द्वारे त्वरित तपासणी',
      step2Desc: 'आर्टिफिशिअल इंटेलिजन्स पानावरील बुरशी, जिवाणू आणि रोगाची तीव्रता तत्काळ दाखवतो.',
      step3Title: '३. योग्य औषध आणि प्रमाण',
      step3Desc: 'स्वस्त सेंद्रिय उपाय (निंबोळी अर्क) आणि प्रमाणित रासायनिक फवारणीचे अचूक प्रमाण मिळवा.',
      step4Title: '४. मराठीत आवाज ऐका',
      step4Desc: 'आपल्या मराठी भाषेत सल्ला स्पष्ट आवाजात ऐका आणि त्वरित उपाययोजना करा.',
    },
    scanner: {
      badge: 'AI पान डॉक्टर',
      heading: 'पानांचे रोग निदान व उपचार सल्ला',
      subheading: 'कोणत्याही पिकाच्या पानाचा फोटो अपलोड करा आणि तत्काळ रोगाची माहिती व उपाय जाणून घ्या.',
      samplePrompt: 'किंवा नमुना पिके निवडून पहा:',
      sampleTomato: 'टोमॅटो करपा',
      sampleRice: 'भात ब्लास्ट',
      samplePotato: 'बटाटा करपा',
      sampleSoybean: 'निरोगी सोयाबीन',
      dragDropText: 'पानाचा फोटो येथे ड्रॅग करा किंवा फाईल निवडण्यासाठी क्लिक करा',
      cameraBtn: 'कॅमेऱ्याने फोटो काढा',
      uploadBtn: 'फोटो अपलोड करा',
      analyzing: 'AI पानाचे सूक्ष्म विश्लेषण करत आहे...',
      resultsTitle: 'तपासणी अहवाल व उपचार सल्ला',
      confidenceLabel: 'अचूकता',
      foliarDamage: 'पानाचा बाधित भाग',
      severityLabel: 'गंभीरता स्थिती',
      organicTitle: '🌿 सेंद्रिय व नैसर्गिक उपचार',
      chemicalTitle: '🧪 प्रमाणित रासायनिक औषध व फवारणी प्रमाण',
      listenAloud: 'सल्ला आवाजात ऐका',
      stopAudio: 'आवाज थांबवा',
      fieldNameLabel: 'शेताचे / प्लॉटचे नाव',
      fieldNamePlaceholder: 'उदा. विहिरीजवळील शेत #१',
      saveToVault: 'शेत नोंदवहीत जतन करा',
      savedSuccess: 'नोंदवहीत सुरक्षित जतन झाले!',
      saving: 'जतन करत आहे...',
      shareReport: 'तपासणी अहवाल शेअर करा',
      criticalBadge: 'गंभीर प्रादुर्भाव',
      warningBadge: 'काळजी आवश्यक',
      healthyBadge: 'उत्तम निरोगी',
    },
    cropML: {
      badge: 'कृषी शिफारस इंजिन',
      heading: 'माती आरोग्य व सर्वाधिक नफ्याचे पीक',
      subheading: 'आपल्या मातीतील NPK, pH आणि हवामानाची माहिती भरून आपल्या शेतासाठी फायदेशीर पीक निवडा.',
      presetsLabel: 'प्रदेशानुसार मातीची माहिती निवडा:',
      presetPunjab: 'पंजाब (गहू पट्टा)',
      presetKarnataka: 'कर्नाटक (रब्बी पिके)',
      presetBengal: 'बंगाल (भात शेती)',
      presetGujarat: 'गुजरात (काळी सुपीक माती)',
      nitrogen: 'नायट्रोजन (N) किलो/हेक्टर',
      phosphorus: 'फॉस्फरस (P) किलो/हेक्टर',
      potassium: 'पोटॅशियम (K) किलो/हेक्टर',
      ph: 'मातीचा सामू (pH)',
      temperature: 'तापमान (°C)',
      humidity: 'हवेतील आर्द्रता (%)',
      rainfall: 'हंगामी पाऊस (मिमी)',
      predictBtn: 'योग्य पिकाची शिफारस मिळवा',
      calculating: 'मातीचे विश्लेषण चालू आहे...',
      resultTitle: 'शिफारस केलेले पीक व उत्पादन तपशील',
      yieldPotential: 'अपेक्षित उत्पादन',
      mspRate: 'किमान आधारभूत किंमत (MSP)',
      waterDemand: 'पाण्याची गरज',
      netMargin: 'अंदाजे निव्वळ नफा',
      altCrop: 'पर्यायी पिकाचा पर्याय',
      rationale: 'कृषी वैज्ञानिक कारण',
      askAI: 'किसान AI ला या पिकाच्या लागवडीबद्दल विचारा',
    },
    telemetry: {
      badge: 'थेट शेती माहिती',
      heading: 'APMC बाजार भाव व हवामान इशारा',
      subheading: 'महाराष्ट्रातील व देशातील प्रमुख बाजार समित्यांचे ताजे भाव व बुरशी रोगाचा धोका.',
      mandiTableTitle: 'आजचे कृषी उत्पन्न बाजार समिती भाव',
      colCommodity: 'पीक / शेतमाल',
      colVariety: 'वाण',
      colMandi: 'बाजार समिती',
      colState: 'राज्य',
      colPrice: 'सरासरी भाव (₹/क्विंटल)',
      colTrend: '२४ तासांचा कल',
      sporeTitle: 'बुरशी रोग व बीजाणू अलर्ट',
      sporeBadge: 'अति आर्द्रतेचा इशारा',
      riskIndex: 'रोग धोका निर्देशांक',
      sporeWarning: 'सकाळी पडणारे धुके आणि पानांवर १४ तासांहून अधिक काळ राहणारा ओलावा यामुळे करपा व तांबेरा रोग पसरण्याचा धोका जास्त आहे.',
      sporeRemedy: 'पुढील पावसापूर्वी प्रतिबंधात्मक निंबोळी अर्क किंवा कॉपरयुक्त बुरशीनाशकाची फवारणी करा.',
      soilHealthTitle: 'मातीचा ओलावा व शेतातील परिस्थिती',
      liveTelemetry: 'थेट शेत सेन्सर निरीक्षण',
      rootMoisture: 'मुळांजवळील ओलावा',
      goodMoisture: 'उत्तम ओलावा',
      rootDepthDesc: 'मुळांची खोली: १५ सेमी • सध्यातरी पाणी देण्याची गरज नाही',
      saltLevel: 'मातीतील क्षार / खत पातळी',
      normalFertility: 'योग्य सुपीकता',
      saltDesc: 'संतुलित रासायनिक घटक, मुळांच्या वाढीसाठी पोषक',
      bedTemp: 'मातीचे तापमान',
      idealRoots: 'मुळांसाठी अनुकूल',
      tempDesc: 'गांडूळ आणि उपयुक्त जिवाणूंसाठी सुरक्षित तापमान',
      sunlight: 'सूर्यप्रकाश व दिवसाचे तास',
      goodSun: 'योग्य सूर्यप्रकाश',
      sunDesc: 'प्रकाश संश्लेषणासाठी पुरेसा सूर्यप्रकाश उपलब्ध',
    },
    schemes: {
      badge: 'सरकारी शेतकरी कल्याण योजना',
      heading: 'शासकीय शेतकरी योजना व २४x७ मदत केंद्र',
      subheading: 'शेतकऱ्यांसाठी थेट आर्थिक मदत, पीक विमा आणि शून्य-व्याज कर्जाची सविस्तर माहिती.',
      pmKisanTitle: 'पीएम किसान सन्मान निधी',
      pmKisanDesc: 'शेतकरी कुटुंबांना दरवर्षी ₹६,००० थेट बँक खात्यात ३ समान हप्त्यांमध्ये मिळतात.',
      pmfbyTitle: 'पंतप्रधान पीक विमा योजना (PMFBY)',
      pmfbyDesc: 'पेरणीपासून काढणीपर्यंत नैसर्गिक आपत्ती, दुष्काळ व अतिवृष्टीमुळे होणाऱ्या नुकसानीचे पूर्ण विमा संरक्षण.',
      shcTitle: 'मृदा आरोग्य पत्रिका योजना (Soil Health Card)',
      shcDesc: 'दर २ वर्षांनी मातीची मोफत चाचणी, ज्यामुळे रासायनिक खतांचा योग्य व संतुलित वापर करता येतो.',
      kccTitle: 'किसान क्रेडिट कार्ड (KCC)',
      kccDesc: 'वेळेवर परतफेड केल्यास ४% सवलतीच्या व्याजदरावर शेती कर्ज आणि ₹१.६ लाखांपर्यंत विनातारण कर्ज.',
      helplineTitle: 'किसान कॉल सेंटर (टोल फ्री २४x७)',
      helplineNumber: '१८००-१८०-१५५१',
      helplineDesc: '२२ भारतीय भाषांमध्ये कृषी तज्ज्ञांकडून थेट फोनवर मोफत सल्ला, सकाळी ६:०० ते रात्री १०:००.',
      viewPortal: 'अधिकृत पोर्टल उघडा',
      callNow: 'आता कॉल करा',
    },
    vault: {
      badge: 'शेत नोंदवही व सुरक्षित रेकॉर्ड',
      heading: 'माझ्या शेताचे रोगनिदान व अहवाल',
      subheading: 'पूर्वी तपासलेली पाने, रोगांवरील फवारणी आणि माती शिफारसींचा इतिहास सुरक्षित ठेवा.',
      totalScans: 'एकूण तपासण्या',
      activeFields: 'सक्रिय शेतजमीन',
      criticalCases: 'गंभीर रोग केसेस',
      soilPlans: 'माती नियोजन',
      filterAll: 'सर्व नोंदी',
      filterCritical: 'गंभीर समस्या',
      filterHealthy: 'निरोगी पिके',
      noRecords: 'कोणतीही नोंद सापडली नाही',
      noRecordsDesc: 'पानांची तपासणी करा किंवा मातीचे नियोजन करून आपल्या नोंदवहीत जोडा.',
      printExport: 'अहवाल प्रिंट / पीडीएफ डाऊनलोड करा',
      scanNew: 'नवीन पान तपासा',
    },
    chatbot: {
      botLanguageLabel: 'चॅटबॉटची भाषा (बोलणे व उत्तरे):',
      badge: 'मातृभाषा किसान AI सहाय्यक',
      title: 'किसान AI सहाय्यक',
      subtitle: 'आपल्या भाषेत बोलून किंवा लिहून शेतीविषयक प्रश्न विचारा',
      welcome: 'नमस्कार शेतकरी बंधूंनो! मी आपला कृषी रक्षक साथीदार आहे. आपल्या भाषेत शेतीविषयक कोणताही प्रश्न विचारा — पानांच्या रोगावरील औषधे, सेंद्रिय कीटकनाशके किंवा आजचे बाजार भाव.',
      inputPlaceholder: 'आपला प्रश्न येथे लिहा किंवा माइक दाबून बोला...',
      listening: 'ऐकत आहे... कृपया बोला...',
      speakBtn: 'आवाजात ऐका',
      stopSpeech: 'आवाज थांबवा',
      send: 'पाठवा',
      quickPrompt1: 'युरियाच्या एका गोणीऐवजी कोणते सेंद्रिय खत वापरावे?',
      quickPrompt2: 'महाराष्ट्रात हरभरा पेरणीसाठी सर्वात योग्य वेळ कोणती?',
      quickPrompt3: 'आज लासलगाव किंवा नाशिक बाजारात कांद्याचा भाव काय आहे?',
      quickPrompt4: 'टोमॅटोच्या करप्यासाठी मॅन्कोझेबचे प्रमाण किती असावे?',
      kccHelplinePrompt: 'किसान कॉल सेंटरचा मोफत फोन नंबर काय आहे?',
    },
    footer: {
      aboutTitle: 'कृषी रक्षक बद्दल',
      aboutDesc: 'कृषी रक्षक हे भारतीय शेतकऱ्यांसाठी तयार केलेले मोफत कृषी AI सहाय्यक आहे. रोगांचे त्वरित निदान, मातीनुसार पीक सल्ला आणि थेट बाजार भाव उपलब्ध करून देणे हे आमचे ध्येय आहे.',
      quickLinks: 'महत्त्वाच्या लिंक्स',
      schemesLink: 'सरकारी योजना व मदत',
      scannerLink: 'पान डॉक्टर (रोग तपासणी)',
      advisorLink: 'पीक सल्लागार (माती शिफारस)',
      helplineTitle: 'तातडीची शेतकरी हेल्पलाइन',
      helplineDesc: 'टोल फ्री १८००-१८०-१५५१ (किसान कॉल सेंटर, कृषी व शेतकरी कल्याण मंत्रालय, भारत सरकार)',
      copyright: 'भारतीय शेतकऱ्यांच्या सेवेत समर्पित • जय जवान, जय किसान 🌾',
    },
    auth: {
      title: 'शेतकरी खाते लॉग इन करा',
      subtitle: 'आपल्या शेताचे सर्व अहवाल सुरक्षित ठेवण्यासाठी लॉग इन करा.',
      emailLabel: 'ईमेल पत्ता',
      passwordLabel: 'पासवर्ड',
      nameLabel: 'शेतकऱ्याचे पूर्ण नाव',
      signInBtn: 'लॉग इन करा',
      signUpBtn: 'नवीन खाते उघडा',
      googleBtn: 'गुगल खात्याने लॉग इन करा',
      or: 'किंवा',
      toggleSignUp: 'खाते नाही? नवीन खाते उघडा',
      toggleSignIn: 'आधीच खाते आहे? लॉग इन करा',
    },
  },

  // 4. KANNADA (ಕನ್ನಡ)
  kn: {
    nav: {
      home: 'ಮುಖಪುಟ',
      leafDoctor: 'ಎಲೆ ವೈದ್ಯ',
      cropAdvisor: 'ಬೆಳೆ ಸಲಹೆಗಾರ',
      mandiWeather: 'ಮಾರುಕಟ್ಟೆ & ಹವಾಮಾನ',
      askKisanAI: 'ಕಿಸಾನ್ AI ಕೇಳಿ',
      schemes: 'ರೈತ ಯೋಜನೆಗಳು & ನೆರವು',
      vault: 'ನನ್ನ ಕೃಷಿ ಪುಸ್ತಕ',
      freeBadge: '🌾 ರೈತರಿಗೆ 100% ಉಚಿತ',
      checkLeaf: 'ಎಲೆ ಪರೀಕ್ಷಿಸಿ',
      homeBtn: 'ಮುಖಪುಟ',
      voiceReadout: 'ಧ್ವನಿ',
      signIn: 'ಲಾಗಿನ್',
      signOut: 'ಸೈನ್ ಔಟ್',
      kisanCallCenter: 'ಕಿಸಾನ್ ಸಹಾಯವಾಣಿ 1800-180-1551',
    },
    hero: {
      tickerAccurate: '98.4% ನಿಖರ ರೋಗ ಪತ್ತೆ ವಿಜ್ಞಾನ',
      tickerDiseases: '38+ ಬೆಳೆ ರೋಗಗಳ ಪತ್ತೆ',
      tickerMandi: 'ನೇರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು',
      tickerHelpline: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551 (24x7)',
      badge: 'ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ರಕ್ಷಕ • ರೈತ ಮಿತ್ರ',
      headline1: 'ಬೆಳೆ ರಕ್ಷಿಸಿ.',
      headline2: 'ಅಧಿಕ ಇಳುವರಿ ಪಡೆಯಿರಿ.',
      headline3: '',
      description: 'ಎಲೆಯ ಫೋಟೋ ತೆಗೆದು ಕೇವಲ 3 ಸೆಕೆಂಡುಗಳಲ್ಲಿ ರೋಗ ಪತ್ತೆಹಚ್ಚಿ, ಮಣ್ಣಿನ ಗುಣಲಕ್ಷಣಗಳ ಆಧಾರದ ಮೇಲೆ ಲಾಭದಾಯಕ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರ ತಿಳಿಯಿರಿ.',
      btnDiagnose: 'ಎಲೆ ರೋಗ ಪರೀಕ್ಷಿಸಿ',
      btnCropML: 'AI ಯಿಂದ ಉತ್ತಮ ಬೆಳೆ ಆಯ್ಕೆ',
      stat1Val: '38+',
      stat1Lbl: 'ಪತ್ತೆಹಚ್ಚಬಹುದಾದ ರೋಗಗಳು',
      stat2Val: '98.4%',
      stat2Lbl: 'ನಿಖರತೆ ಪ್ರಮಾಣ',
      stat3Val: '6 ಭಾಷೆಗಳು',
      stat3Lbl: 'ಕನ್ನಡ ಧ್ವನಿ ಬೆಂಬಲ ಲಭ್ಯ',
      hudCrop: 'ಟೊಮ್ಯಾಟೋ ಮುಂಜಾನೆ ರೋಗ',
      hudAction: 'ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 2 ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ',
      hudConfidence: '98.4% ನಿಖರತೆ',
      hudStatus: 'ತಕ್ಷಣದ ಕ್ರಮ ಅಗತ್ಯ',
    },
    pipeline: {
      badge: 'ಕೃಷಿಯ ಪ್ರಮುಖ ಸವಾಲುಗಳು',
      heading: 'ರೋಗವನ್ನು ಮೊದಲೇ ಪತ್ತೆಹಚ್ಚುವುದು ಏಕೆ ಮುಖ್ಯ?',
      subheading: 'ಸಕಾಲದಲ್ಲಿ ರೋಗ ಪತ್ತೆಯಾಗದ ಕಾರಣ ದೇಶದ ರೈತರು ಶೇ 40 ರಷ್ಟು ಇಳುವರಿ ನಷ್ಟ ಅನುಭವಿಸುತ್ತಾರೆ.',
      c1Title: 'ಅನಿಶ್ಚಿತ ಹವಾಮಾನ',
      c1Desc: 'ಧಿಡೀರ್ ಮಳೆ ಮತ್ತು ಅಧಿಕ ತೇವಾಂಶದಿಂದ ಶಿಲೀಂಧ್ರ ರೋಗಗಳು ರಾತ್ರೋರಾತ್ರಿ ಹರಡುತ್ತವೆ.',
      c2Title: 'ರೋಗ ಪತ್ತೆಯಲ್ಲಿ ವಿಳಂಬ',
      c2Desc: 'ಲಕ್ಷಣಗಳು ಕಣ್ಣಿಗೆ ಸ್ಪಷ್ಟವಾಗಿ ಕಾಣುವ ಹೊತ್ತಿಗೆ ಬೆಳೆಯು ತೀವ್ರವಾಗಿ ಹಾನಿಗೊಳಗಾಗಿರುತ್ತದೆ.',
      c3Title: 'ಅಧಿಕ ಕೀಟನಾಶಕ ವೆಚ್ಚ',
      c3Desc: 'ಸರಿಯಾದ ಔಷಧ ತಿಳಿಯದೆ ದುಬಾರಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸುವುದರಿಂದ ಸಾಲದ ಹೊರೆ ಹೆಚ್ಚುತ್ತದೆ.',
      c4Title: 'ಭಾಷಾ ತೊಡಕುಗಳು',
      c4Desc: 'ವೈಜ್ಞಾನಿಕ ಕೃಷಿ ಸಲಹೆಗಳು ಹೆಚ್ಚಾಗಿ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿರುವುದರಿಂದ ರೈತರಿಗೆ ತಲುಪುವುದಿಲ್ಲ.',
      guideTitle: 'ಕೃಷಿ ರಕ್ಷಕ ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ (4 ಹಂತಗಳು)',
      step1Title: '1. ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ',
      step1Desc: 'ಮೊಬೈಲ್ ಕ್ಯಾಮೆರಾದಿಂದ ಪೀಡಿತ ಎಲೆಯ ಸ್ಪಷ್ಟ ಚಿತ್ರ ತೆಗೆದುಕೊಳ್ಳಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.',
      step2Title: '2. ತಕ್ಷಣದ AI ರೋಗ ಪತ್ತೆ',
      step2Desc: 'ಆರ್ಟಿಫಿಶಿಯಲ್ ಇಂಟೆಲಿಜೆನ್ಸ್ ರೋಗದ ಲಕ್ಷಣ, ಶೇಕಡಾವಾರು ಹಾನಿ ಮತ್ತು ತೀವ್ರತೆಯನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತದೆ.',
      step3Title: '3. ಸೂಕ್ತ ಔಷಧ ಮತ್ತು ಪ್ರಮಾಣ',
      step3Desc: 'ಕಡಿಮೆ ವೆಚ್ಚದ ಜೈವಿಕ ಔಷಧಗಳು (ಬೇವಿನ ಎಣ್ಣೆ) ಹಾಗೂ ಪ್ರಮಾಣೀಕೃತ ರಾಸಾಯನಿಕಗಳ ಸರಿಯಾದ ಅಳತೆ ಪಡೆಯಿರಿ.',
      step4Title: '4. ಕನ್ನಡದಲ್ಲೇ ಆಲಿಸಿ',
      step4Desc: 'ಸಲಹೆಯನ್ನು ಕನ್ನಡ ಭಾಷೆಯ ಧ್ವನಿಯಲ್ಲಿ ಸ್ಪಷ್ಟವಾಗಿ ಕೇಳಿ ತಕ್ಷಣ ಸಿಂಪಡಿಸಿ.',
    },
    scanner: {
      badge: 'AI ಎಲೆ ವೈದ್ಯ',
      heading: 'ಬೆಳೆ ರೋಗ ಪತ್ತೆ ಮತ್ತು ಪರಿಹಾರ ಕೇಂದ್ರ',
      subheading: 'ಯಾವುದೇ ಬೆಳೆಯ ಎಲೆಯ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ ತಕ್ಷಣ ನಿಖರ ರೋಗ ಮತ್ತು ಔಷಧಿ ಮಾಹಿತಿ ಪಡೆಯಿರಿ.',
      samplePrompt: 'ಅಥವಾ ಮಾದರಿ ಬೆಳೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ:',
      sampleTomato: 'ಟೊಮ್ಯಾಟೋ ಮುರುಟು ರೋಗ',
      sampleRice: 'ಭತ್ತದ ಬ್ಲಾಸ್ಟ್',
      samplePotato: 'ಆಲೂಗೆಡ್ಡೆ ತಡವಾದ ರೋಗ',
      sampleSoybean: 'ಆರೋಗ್ಯಕರ ಸೋಯಾಬೀನ್',
      dragDropText: 'ಎಲೆಯ ಫೋಟೋವನ್ನು ಇಲ್ಲಿಗೆ ಎಳೆಯಿರಿ ಅಥವಾ ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ',
      cameraBtn: 'ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ ತೆಗೆಯಿರಿ',
      uploadBtn: 'ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
      analyzing: 'AI ಎಲೆಯ ಕಣಗಳನ್ನು ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ...',
      resultsTitle: 'ರೋಗ ಪತ್ತೆ ವರದಿ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಮಾಹಿತಿ',
      confidenceLabel: 'ನಿಖರತೆ',
      foliarDamage: 'ಹಾನಿಯಾದ ಎಲೆಯ ಶೇಕಡಾವಾರು',
      severityLabel: 'ಸ್ಥಿತಿಗತಿಯ ತೀವ್ರತೆ',
      organicTitle: '🌿 ಸಾವಯವ ಮತ್ತು ನೈಸರ್ಗಿಕ ಪರಿಹಾರಗಳು',
      chemicalTitle: '🧪 ಪ್ರಮಾಣೀಕೃತ ರಾಸಾಯನಿಕ ಔಷಧ ಮತ್ತು ಪ್ರಮಾಣ',
      listenAloud: 'ಸಲಹೆಯನ್ನು ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ',
      stopAudio: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
      fieldNameLabel: 'ಹೊಲ / ಪ್ಲಾಟ್ ಹೆಸರು',
      fieldNamePlaceholder: 'ಉದಾ: ಬಾವಿಯ ಹತ್ತಿರದ ಜಮೀನು #1',
      saveToVault: 'ನನ್ನ ಕೃಷಿ ಪುಸ್ತಕದಲ್ಲಿ ಉಳಿಸಿ',
      savedSuccess: 'ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!',
      saving: 'ಉಳಿಸಲಾಗುತ್ತಿದೆ...',
      shareReport: 'ವರದಿಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ',
      criticalBadge: 'ತೀವ್ರ ರೋಗಬಾಧೆ',
      warningBadge: 'ಎಚ್ಚರಿಕೆ ಅಗತ್ಯ',
      healthyBadge: 'ಆರೋಗ್ಯಕರ ಬೆಳೆ',
    },
    cropML: {
      badge: 'ಕೃಷಿ ಶಿಫಾರಸು ಎಂಜಿನ್',
      heading: 'ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಗರಿಷ್ಠ ಲಾಭದ ಬೆಳೆ',
      subheading: 'ನಿಮ್ಮ ಮಣ್ಣಿನ ಪರೀಕ್ಷಾ ಮೌಲ್ಯಗಳನ್ನು (NPK, pH) ನಮೂದಿಸಿ ಹೆಚ್ಚು ಲಾಭ ನೀಡುವ ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.',
      presetsLabel: 'ಪ್ರದೇಶವಾರು ಮಣ್ಣಿನ ಮಾದರಿ ಆಯ್ಕೆಮಾಡಿ:',
      presetPunjab: 'ಪಂಜಾಬ್ (ಗೋಧಿ ಬೆಲ್ಟ್)',
      presetKarnataka: 'ಕರ್ನಾಟಕ (ಹಿಂಗಾರು ಬೆಳೆಗಳು)',
      presetBengal: 'ಬಂಗಾಳ (ಭತ್ತದ ಗದ್ದೆಗಳು)',
      presetGujarat: 'ಗುಜರಾತ್ (ಕಪ್ಪು ಮಣ್ಣು)',
      nitrogen: 'ಸಾರಜನಕ (N) ಕೆಜಿ/ಹೆಕ್ಟೇರ್',
      phosphorus: 'ರಂಜಕ (P) ಕೆಜಿ/ಹೆಕ್ಟೇರ್',
      potassium: 'ಪೊಟ್ಯಾಶ್ (K) ಕೆಜಿ/ಹೆಕ್ಟೇರ್',
      ph: 'ಮಣ್ಣಿನ ರಸಸಾರ (pH)',
      temperature: 'ತಾಪಮಾನ (°C)',
      humidity: 'ತೇವಾಂಶ (%)',
      rainfall: 'ಮಳೆಯ ಪ್ರಮಾಣ (ಮಿಮೀ)',
      predictBtn: 'ಉತ್ತಮ ಬೆಳೆಯನ್ನು ಶಿಫಾರಸು ಮಾಡಿ',
      calculating: 'ಮಣ್ಣಿನ ವಿಶ್ಲೇಷಣೆ ನಡೆಯುತ್ತಿದೆ...',
      resultTitle: 'ಶಿಫಾರಸು ಮಾಡಲಾದ ಬೆಳೆಯ ವಿವರ',
      yieldPotential: 'ಅಂದಾಜು ಇಳುವರಿ',
      mspRate: 'ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP)',
      waterDemand: 'ನೀರಿನ ಅವಶ್ಯಕತೆ',
      netMargin: 'ಅಂದಾಜು ನಿವ್ವಳ ಲಾಭ',
      altCrop: 'ಪರ್ಯಾಯ ಬೆಳೆಯ ಆಯ್ಕೆ',
      rationale: 'ವೈಜ್ಞಾನಿಕ ಸಮರ್ಥನೆ',
      askAI: 'ಈ ಬೆಳೆ ಬೆಳೆಯುವ ವಿಧಾನದ ಬಗ್ಗೆ AI ಯನ್ನು ಕೇಳಿ',
    },
    telemetry: {
      badge: 'ನೇರ ಕೃಷಿ ಮಾಹಿತಿ',
      heading: 'APMC ಮಾರುಕಟ್ಟೆ ದರಗಳು & ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ',
      subheading: 'ರಾಜ್ಯದ ಮತ್ತು ದೇಶದ ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆಗಳ ಇಂದಿನ ಧಾರಣೆ ಮತ್ತು ರೋಗ ಹರಡುವ ಸಾಧ್ಯತೆಯ ಎಚ್ಚರಿಕೆ.',
      mandiTableTitle: 'ಇಂದಿನ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ದರಗಳು',
      colCommodity: 'ಬೆಳೆ / ಧಾನ್ಯ',
      colVariety: 'ತಳಿ',
      colMandi: 'ಮಾರುಕಟ್ಟೆ',
      colState: 'ರಾಜ್ಯ',
      colPrice: 'ಸರಾಸರಿ ದರ (₹/ಕ್ವಿಂಟಲ್)',
      colTrend: '24 ಗಂಟೆಯ ಪ್ರವೃತ್ತಿ',
      sporeTitle: 'ಶಿಲೀಂಧ್ರ ರೋಗ ಮತ್ತು ಬೀಜಕ ಎಚ್ಚರಿಕೆ',
      sporeBadge: 'ಅಧಿಕ ತೇವಾಂಶದ ಎಚ್ಚರಿಕೆ',
      riskIndex: 'ರೋಗ ಅಪಾಯದ ಸೂಚ್ಯಂಕ',
      sporeWarning: 'ಬೆಳಗಿನ ಮಂಜು ಮತ್ತು ಎಲೆಗಳಲ್ಲಿ 14 ಗಂಟೆಗಳಿಗೂ ಹೆಚ್ಚು ಕಾಲ ತೇವಾಂಶ ಇರುವುದರಿಂದ ರೋಗ ಹರಡುವ ಸಾಧ್ಯತೆ ಹೆಚ್ಚಾಗಿದೆ.',
      sporeRemedy: 'ಮಳೆ ಬರುವ ಮುನ್ನ ಮುನ್ನೆಚ್ಚರಿಕೆಯಾಗಿ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.',
      soilHealthTitle: 'ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಜಮೀನಿನ ಸ್ಥಿತಿ',
      liveTelemetry: 'ನೇರ ಫೀಲ್ಡ್ ಸೆನ್ಸರ್ ವರದಿ',
      rootMoisture: 'ಬೇರಿನ ವಲಯದ ತೇವಾಂಶ',
      goodMoisture: 'ಉತ್ತಮ ತೇವಾಂಶ',
      rootDepthDesc: 'ಬೇರಿನ ಆಳ: 15 ಸೆಂ.ಮೀ • ಈಗ ನೀರುಣಿಸುವ ಅಗತ್ಯವಿಲ್ಲ',
      saltLevel: 'ಮಣ್ಣಿನ ಲವಣಾಂಶ / ಗೊಬ್ಬರದ ಮಟ್ಟ',
      normalFertility: 'ಸಾಮಾನ್ಯ ಫಲವತ್ತತೆ',
      saltDesc: 'ಸಮತೋಲಿತ ರಾಸಾಯನಿಕ ಅಂಶಗಳು, ಬೇರುಗಳ ಬೆಳವಣಿಗೆಗೆ ಸೂಕ್ತ',
      bedTemp: 'ಮಣ್ಣಿನ ತಾಪಮಾನ',
      idealRoots: 'ಬೇರುಗಳಿಗೆ ಸೂಕ್ತ',
      tempDesc: 'ಎರೆಹುಳುಗಳು ಮತ್ತು ಪ್ರಯೋಜನಕಾರಿ ಸೂಕ್ಷ್ಮಾಣುಜೀವಿಗಳಿಗೆ ಉತ್ತಮ',
      sunlight: 'ಸೂರ್ಯನ ಬೆಳಕು ಮತ್ತು ಹಗಲಿನ ಸಮಯ',
      goodSun: 'ಉತ್ತಮ ಬಿಸಿಲು',
      sunDesc: 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆಗೆ ಸಾಕಷ್ಟು ಬೆಳಕು ಲಭ್ಯವಿದೆ',
    },
    schemes: {
      badge: 'ಸರ್ಕಾರಿ ರೈತ ಕಲ್ಯಾಣ ಯೋಜನೆಗಳು',
      heading: 'ಕೇಂದ್ರ & ರಾಜ್ಯ ರೈತ ಯೋಜನೆಗಳು ಮತ್ತು ಸಹಾಯವಾಣಿ',
      subheading: 'ರೈತರಿಗೆ ಆರ್ಥಿಕ ನೆರವು, ಬೆಳೆ ವಿಮೆ ಮತ್ತು ಬಡ್ಡಿರಹಿತ ಸಾಲ ಸೌಲಭ್ಯಗಳ ಸಂಪೂರ್ಣ ಮಾಹಿತಿ.',
      pmKisanTitle: 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
      pmKisanDesc: 'ಅರ್ಹ ರೈತ ಕುಟುಂಬಗಳಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ಹಣಕಾಸಿನ ನೆರವು (3 ಕಂತುಗಳಲ್ಲಿ) ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ.',
      pmfbyTitle: 'ಪ್ರಧಾನಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (PMFBY)',
      pmfbyDesc: 'ಬಿತ್ತನೆಯಿಂದ ಕಟಾವಿನವರೆಗೆ ನೈಸರ್ಗಿಕ ವಿಕೋಪ, ಬರ ಮತ್ತು ಅಕಾಲಿಕ ಮಳೆಯಿಂದ ಉಂಟಾಗುವ ನಷ್ಟಕ್ಕೆ ಸಂಪೂರ್ಣ ವಿಮಾ ರಕ್ಷಣೆ.',
      shcTitle: 'ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಯೋಜನೆ (Soil Health Card)',
      shcDesc: 'ಪ್ರತಿ 2 ವರ್ಷಗಳಿಗೊಮ್ಮೆ ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮತ್ತು ರಸಗೊಬ್ಬರಗಳ ಸಮತೋಲಿತ ಬಳಕೆಯ ಮಾರ್ಗದರ್ಶನ.',
      kccTitle: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC)',
      kccDesc: 'ಶೇಕಡಾ 4 ರ ರಿಯಾಯಿತಿ ಬಡ್ಡಿದರದಲ್ಲಿ ಕೃಷಿ ಸಾಲ ಮತ್ತು ₹1.6 ಲಕ್ಷದವರೆಗೆ ಭದ್ರತೆಯಿಲ್ಲದೆ ಸುಲಭ ಸಾಲ.',
      helplineTitle: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ (ಟೋಲ್ ಫ್ರೀ 24x7)',
      helplineNumber: '1800-180-1551',
      helplineDesc: 'ಕೃಷಿ ತಜ್ಞರಿಂದ ಕನ್ನಡ ಸೇರಿದಂತೆ 22 ಪ್ರಾದೇಶಿಕ ಭಾಷೆಗಳಲ್ಲಿ ಉಚಿತ ದೂರವಾಣಿ ಸಲಹೆ, ಬೆಳಗ್ಗೆ 6:00 ರಿಂದ ರಾತ್ರಿ 10:00.',
      viewPortal: 'ಅಧಿಕೃತ ಪೋರ್ಟಲ್ ತೆರೆಯಿರಿ',
      callNow: 'ಈಗಲೇ ಕರೆ ಮಾಡಿ',
    },
    vault: {
      badge: 'ಕೃಷಿ ದಾಖಲೆಗಳು & ನೋಟ್‌ಬುಕ್',
      heading: 'ನನ್ನ ಜಮೀನಿನ ರೋಗ ಪತ್ತೆ ದಾಖಲೆಗಳು',
      subheading: 'ಹಿಂದೆ ಪರೀಕ್ಷಿಸಿದ ಎಲೆಗಳು, ಸಿಂಪಡಿಸಿದ ಔಷಧಿಗಳು ಮತ್ತು ಮಣ್ಣಿನ ಶಿಫಾರಸುಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಿ.',
      totalScans: 'ಒಟ್ಟು ಪರೀಕ್ಷೆಗಳು',
      activeFields: 'ಸಕ್ರಿಯ ಜಮೀನುಗಳು',
      criticalCases: 'ತೀವ್ರ ರೋಗ ಪ್ರಕರಣಗಳು',
      soilPlans: 'ಮಣ್ಣಿನ ಬೆಳೆ ಯೋಜನೆಗಳು',
      filterAll: 'ಎಲ್ಲಾ ದಾಖಲೆಗಳು',
      filterCritical: 'ತುರ್ತು ಸಮಸ್ಯೆಗಳು',
      filterHealthy: 'ಆರೋಗ್ಯಕರ ಬೆಳೆಗಳು',
      noRecords: 'ಯಾವುದೇ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ',
      noRecordsDesc: 'ಎಲೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ ಅಥವಾ ಮಣ್ಣಿನ ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆದು ನಿಮ್ಮ ನೋಟ್‌ಬುಕ್‌ನಲ್ಲಿ ಉಳಿಸಿ.',
      printExport: 'ವರದಿ ಪ್ರಿಂಟ್ / ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್',
      scanNew: 'ಹೊಸ ಎಲೆ ಪರೀಕ್ಷಿಸಿ',
    },
    chatbot: {
      botLanguageLabel: 'ಚಾಟ್‌ಬಾಟ್ ಭಾಷೆ (ಧ್ವನಿ ಮತ್ತು ಉತ್ತರಗಳು):',
      badge: 'ಕನ್ನಡ ಕಿಸಾನ್ AI ಸಹಾಯಕ',
      title: 'ಕಿಸಾನ್ AI ಸಹಾಯಕ',
      subtitle: 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲೇ ಧ್ವನಿ ಮೂಲಕ ಅಥವಾ ಟೈಪ್ ಮಾಡಿ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ',
      welcome: 'ನಮಸ್ಕಾರ ರೈತ ಬಾಂಧವರೇ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ರಕ್ಷಕ ಕೃಷಿ ಸಂಗಾತಿ. ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲೇ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ — ಎಲೆ ರೋಗದ ಔಷಧ, ನೈಸರ್ಗಿಕ ಕ್ರಿಮಿನಾಶಕ, ಬಿತ್ತನೆ ಮಾಹಿತಿ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ದರಗಳು.',
      inputPlaceholder: 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ ಅಥವಾ ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ...',
      listening: 'ಆಲಿಸುತ್ತಿದೆ... ದಯವಿಟ್ಟು ಮಾತನಾಡಿ...',
      speakBtn: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ',
      stopSpeech: 'ಧ್ವನಿ ನಿಲ್ಲಿಸಿ',
      send: 'ಕಳುಹಿಸಿ',
      quickPrompt1: 'ಒಂದು ಚೀಲ ಯೂರಿಯಾ ಬದಲಿಗೆ ಯಾವ ನೈಸರ್ಗಿಕ ಗೊಬ್ಬರ ಬಳಸಬಹುದು?',
      quickPrompt2: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಕಡಲೆ ಬಿತ್ತನೆಗೆ ಅತ್ಯಂತ ಸೂಕ್ತ ಸಮಯ ಯಾವುದು?',
      quickPrompt3: 'ಇಂದಿನ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಈರುಳ್ಳಿ ಬೆಲೆ ಎಷ್ಟಿದೆ?',
      quickPrompt4: 'ಟೊಮ್ಯಾಟೋ ರೋಗಕ್ಕೆ ಮ್ಯಾಂಕೋಜೆಬ್ ಪ್ರಮಾಣ ಎಷ್ಟು ಹಾಕಬೇಕು?',
      kccHelplinePrompt: 'ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ ಉಚಿತ ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ ಯಾವುದು?',
    },
    footer: {
      aboutTitle: 'ಕೃಷಿ ರಕ್ಷಕ ಕುರಿತು',
      aboutDesc: 'ಕೃಷಿ ರಕ್ಷಕವು ಭಾರತೀಯ ರೈತರಿಗಾಗಿ ನಿರ್ಮಿಸಲಾದ 100% ಉಚಿತ ಕೃಷಿ AI ಸಹಾಯಕವಾಗಿದೆ. ಎಲೆ ರೋಗಗಳ ಶೀಘ್ರ ಪತ್ತೆ, ಮಣ್ಣಿನ ಆಧಾರಿತ ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿಯನ್ನು ಒದಗಿಸುತ್ತದೆ.',
      quickLinks: 'ಮುಖ್ಯ ಲಿಂಕ್‌ಗಳು',
      schemesLink: 'ರೈತ ಯೋಜನೆಗಳು & ನೆರವು',
      scannerLink: 'ಎಲೆ ವೈದ್ಯ (ರೋಗ ಪರೀಕ್ಷೆ)',
      advisorLink: 'ಬೆಳೆ ಸಲಹೆಗಾರ (ಮಣ್ಣಿನ ML)',
      helplineTitle: 'ತುರ್ತು ರೈತ ಸಹಾಯವಾಣಿ',
      helplineDesc: 'ಟೋಲ್ ಫ್ರೀ 1800-180-1551 (ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್, ಕೃಷಿ ಸಚಿವಾಲಯ, ಭಾರತ ಸರ್ಕಾರ)',
      copyright: 'ಭಾರತೀಯ ಅನ್ನದಾತರಿಗೆ ಸಮರ್ಪಿತ • ಜೈ ಜವಾನ್, ಜೈ ಕಿಸಾನ್ 🌾',
    },
    auth: {
      title: 'ರೈತ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ',
      subtitle: 'ನಿಮ್ಮ ಜಮೀನಿನ ಎಲ್ಲಾ ದಾಖಲೆಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸಲು ಲಾಗಿನ್ ಆಗಿ.',
      emailLabel: 'ಇಮೇಲ್ ವಿಳಾಸ',
      passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
      nameLabel: 'ರೈತರ ಪೂರ್ಣ ಹೆಸರು',
      signInBtn: 'ಲಾಗಿನ್ ಮಾಡಿ',
      signUpBtn: 'ಹೊಸ ಖಾತೆ ರಚಿಸಿ',
      googleBtn: 'ಗೂಗಲ್ ಖಾತೆಯೊಂದಿಗೆ ಮುಂದುವರಿಯಿರಿ',
      or: 'ಅಥವಾ',
      toggleSignUp: 'ಖಾತೆ ಇಲ್ಲವೇ? ಹೊಸ ಖಾತೆ ತೆರೆಯಿರಿ',
      toggleSignIn: 'ಈಗಾಗಲೇ ಖಾತೆ ಹೊಂದಿದ್ದೀರಾ? ಲಾಗಿನ್ ಮಾಡಿ',
    },
  },

  // 5. TELUGU (తెలుగు)
  te: {
    nav: {
      home: 'హోమ్',
      leafDoctor: 'ఆకు డాక్టర్',
      cropAdvisor: 'పంట సలహాదారు',
      mandiWeather: 'మార్కెట్ & వాతావరణం',
      askKisanAI: 'కిసాన్ AI అడగండి',
      schemes: 'రైతు పథకాలు & సహాయం',
      vault: 'నా వ్యవసాయ పుస్తకం',
      freeBadge: '🌾 రైతులకు 100% ఉచితం',
      checkLeaf: 'ఆకు తనిఖీ',
      homeBtn: 'హోమ్',
      voiceReadout: 'వాయిస్',
      signIn: 'సైన్ ఇన్',
      signOut: 'సైన్ అవుట్',
      kisanCallCenter: 'కిసాన్ హెల్ప్‌లైన్ 1800-180-1551',
    },
    hero: {
      tickerAccurate: '98.4% ఖచ్చితమైన పాథాలజీ విజన్',
      tickerDiseases: '38+ పంట తెగుళ్లను గుర్తిస్తుంది',
      tickerMandi: 'లైవ్ మార్కెట్ యార్డ్ ధరలు',
      tickerHelpline: 'కిసాన్ కాల్ సెంటర్ 1800-180-1551 (24x7)',
      badge: 'స్మార్ట్ పంట సంరక్షకుడు • రైతు మిత్రుడు',
      headline1: 'పంటలను కాపాడుకోండి.',
      headline2: 'దిగుబడిని పెంచుకోండి.',
      headline3: '',
      description: 'ఆకు ఫోటో తీసి 3 సెకన్లలో పంట తెగుళ్లను గుర్తించండి, నేల సారం ఆధారంగా అధిక లాభాన్నిచ్చే పంటలను ఎంచుకోండి మరియు మార్కెట్ ధరలను తెలుసుకోండి.',
      btnDiagnose: 'ఆకు తెగులును గుర్తించండి',
      btnCropML: 'AI తో ఉత్తమ పంటను ఎంచుకోండి',
      stat1Val: '38+',
      stat1Lbl: 'గుర్తించదగిన పంట తెగుళ్లు',
      stat2Val: '98.4%',
      stat2Lbl: 'ఖచ్చితమైన రోగ నిర్ధారణ',
      stat3Val: '6 భాషలు',
      stat3Lbl: 'తెలుగు వాయిస్ సదుపాయం',
      hudCrop: 'టొమాటో ముందస్తు మచ్చల తెగులు',
      hudAction: 'లీటరు నీటికి 2 గ్రాముల మాంకోజెబ్ కలిపి పిచికారీ చేయండి',
      hudConfidence: '98.4% ఖచ్చితత్వం',
      hudStatus: 'వెంటనే మందు కొట్టాలి',
    },
    pipeline: {
      badge: 'వ్యవసాయంలో ఎదురయ్యే ప్రధాన సవాళ్లు',
      heading: 'పంట తెగుళ్లను ముందుగానే గుర్తించడం ఎందుకు ముఖ్యం?',
      subheading: 'తెగుళ్లను సకాలంలో గుర్తించకపోవడం వల్ల దేశంలో రైతులు 40% వరకు పంట దిగుబడిని కోల్పోతున్నారు.',
      c1Title: 'అనుకోని వాతావరణ మార్పులు',
      c1Desc: 'అకాల వర్షాలు మరియు పెరిగిన తేమ వల్ల రాత్రికి రాత్రే శిలీంధ్ర తెగుళ్లు వేగంగా వ్యాపిస్తాయి.',
      c2Title: 'తెగుళ్ల ఆలస్య గుర్తింపు',
      c2Desc: 'లక్షణాలు కంటికి కనిపించేసరికి పొలంలో చాలా భాగం తెగులు విస్తరించి నష్టం జరుగుతుంది.',
      c3Title: 'రసాయన మందుల అధిక ఖర్చు',
      c3Desc: 'సరైన అవగాహన లేకుండా ఖరీదైన పురుగుమందులు వాడటం వల్ల పెట్టుబడి పెరిగి అప్పులపాలవుతున్నారు.',
      c4Title: 'భాషా సమస్యలు',
      c4Desc: 'శాస్త్రీయ వ్యవసాయ సలహాలు స్థానిక తెలుగు భాషలో రైతులకు సకాలంలో అందకపోవడం.',
      guideTitle: 'కృషి రక్షక్ ఎలా పనిచేస్తుంది (4 సులభ దశలు)',
      step1Title: '1. ఆకు ఫోటో తీయండి',
      step1Desc: 'మొబైల్ కెమెరాతో తెగులు సోకిన ఆకు స్పష్టమైన ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి.',
      step2Title: '2. వెంటనే AI గుర్తింపు',
      step2Desc: 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ తెగులు రకం, వ్యాపించిన తీవ్రతను క్షణాల్లో విశ్లేషిస్తుంది.',
      step3Title: '3. సరైన మందు మరియు మోతాదు',
      step3Desc: 'తక్కువ ఖర్చుతో కూడిన సేంద్రీయ పరిష్కారాలు (వేప నూనె) మరియు రసాయన మందుల కొలత పొందండి.',
      step4Title: '4. తెలుగులోనే వినండి',
      step4Desc: 'సలహాను మీ మాతృభాష తెలుగులో స్పష్టమైన వాయిస్ ద్వారా విని తగిన చర్యలు తీసుకోండి.',
    },
    scanner: {
      badge: 'AI ఆకు డాక్టర్',
      heading: 'పంట తెగుళ్ల గుర్తింపు & నివారణ కేంద్రం',
      subheading: 'ఏదైనా పంట ఆకు ఫోటో అప్‌లోడ్ చేసి వెంటనే ఖచ్చితమైన తెగులు మరియు మందుల వివరాలు పొందండి.',
      samplePrompt: 'లేదా నమూనా పంటలను పరిశీలించండి:',
      sampleTomato: 'టొమాటో మచ్చల తెగులు',
      sampleRice: 'వరి బ్లాస్ట్ తెగులు',
      samplePotato: 'బంగాళాదుంప తెగులు',
      sampleSoybean: 'ఆరోగ్యకరమైన సోయాబీన్',
      dragDropText: 'ఆకు ఫోటోను ఇక్కడ లాగి వదలండి లేదా ఫైల్ ఎంచుకోవడానికి క్లిక్ చేయండి',
      cameraBtn: 'కెమెరాతో ఫోటో తీయండి',
      uploadBtn: 'ఫోటో అప్‌లోడ్ చేయండి',
      analyzing: 'AI ఆకును నిశితంగా పరిశీలిస్తోంది...',
      resultsTitle: 'రోగ నిర్ధారణ నివేదిక & చికిత్సా సలహా',
      confidenceLabel: 'ఖచ్చితత్వం',
      foliarDamage: 'ఆకు దెబ్బతిన్న శాతం',
      severityLabel: 'తీవ్రత స్థాయి',
      organicTitle: '🌿 సేంద్రీయ & సహజ నివారణలు',
      chemicalTitle: '🧪 సూచించిన రసాయన మందు & పిచికారీ మోతాదు',
      listenAloud: 'సలహాను వాయిస్‌లో వినండి',
      stopAudio: 'ఆడియో ఆపండి',
      fieldNameLabel: 'పొలం / ప్లాట్ పేరు',
      fieldNamePlaceholder: 'ఉదా: బావి దగ్గరి పొలం #1',
      saveToVault: 'వ్యవసాయ పుస్తకంలో భద్రపరచండి',
      savedSuccess: 'విజయవంతంగా భద్రపరచబడింది!',
      saving: 'భద్రపరుస్తోంది...',
      shareReport: 'నివేదికను షేర్ చేయండి',
      criticalBadge: 'తీవ్రమైన తెగులు',
      warningBadge: 'జాగ్రత్త అవసరం',
      healthyBadge: 'పూర్తిగా ఆరోగ్యకరం',
    },
    cropML: {
      badge: 'వ్యవసాయ సిఫార్సు ఇంజిన్',
      heading: 'నేల సారం & గరిష్ట లాభాన్నిచ్చే పంట',
      subheading: 'మీ నేల పరీక్ష విలువలు (NPK, pH) నమోదు చేసి అత్యధిక ఆదాయం ఇచ్చే పంటను తెలుసుకోండి.',
      presetsLabel: 'ప్రాంతం వారీగా నేల వివరాలను ఎంచుకోండి:',
      presetPunjab: 'పంజాబ్ (గోధుమ క్షేత్రాలు)',
      presetKarnataka: 'కర్ణాటక (రబీ పంటలు)',
      presetBengal: 'బెంగాల్ (వరి సాగు)',
      presetGujarat: 'గుజరాత్ (నల్ల రేగడి నేలలు)',
      nitrogen: 'నత్రజని (N) కిలోలు/హెక్టారు',
      phosphorus: 'భాస్వరం (P) కిలోలు/హెక్టారు',
      potassium: 'పొటాష్ (K) కిలోలు/హెక్టారు',
      ph: 'నేల పీహెచ్ (pH)',
      temperature: 'ఉష్ణోగ్రత (°C)',
      humidity: 'తేమ శాతం (%)',
      rainfall: 'వర్షపాతం (మి.మీ)',
      predictBtn: 'ఉత్తమ పంటను సిఫార్సు చేయండి',
      calculating: 'నేల విశ్లేషణ జరుగుతోంది...',
      resultTitle: 'సిఫార్సు చేయబడిన పంట వివరాలు',
      yieldPotential: 'అంచనా దిగుబడి',
      mspRate: 'ప్రభుత్వ మద్దతు ధర (MSP)',
      waterDemand: 'నీటి అవసరం',
      netMargin: 'అంచనా నికర లాభం',
      altCrop: 'ప్రత్యామ్నాయ పంట ఎంపిక',
      rationale: 'శాస్త్రీయ కారణం',
      askAI: 'ఈ పంట సాగు విధానం గురించి కిసాన్ AI ని అడగండి',
    },
    telemetry: {
      badge: 'లైవ్ వ్యవసాయ సమాచారం',
      heading: 'మార్కెట్ ధరలు & వాతావరణ హెచ్చరికలు',
      subheading: 'ప్రధాన మార్కెట్ యార్డులలో పంటల తాజా ధరలు మరియు తెగుళ్లు వ్యాపించే ప్రమాద హెచ్చరికలు.',
      mandiTableTitle: 'నేటి వ్యవసాయ మార్కెట్ ధరలు',
      colCommodity: 'పంట / దినుసులు',
      colVariety: 'రకం',
      colMandi: 'మార్కెట్ యార్డ్',
      colState: 'రాష్ట్రం',
      colPrice: 'సగటు ధర (₹/క్వింటాల్)',
      colTrend: '24 గంటల సరళి',
      sporeTitle: 'శిలీంధ్ర తెగుళ్లు & బీజాంశాల హెచ్చరిక',
      sporeBadge: 'అధిక తేమ హెచ్చరిక',
      riskIndex: 'తెగుళ్ల ముప్పు సూచిక',
      sporeWarning: 'ఉదయం పొగమంచు మరియు 14 గంటలకు పైగా ఆకులపై తేమ ఉండటం వల్ల తెగుళ్లు వ్యాపించే ప్రమాదం చాలా ఎక్కువగా ఉంది.',
      sporeRemedy: 'వర్షం పడకముందే నివారణగా వేప నూనె లేదా కాపర్ ఆధారిత మందులు పిచికారీ చేయండి.',
      soilHealthTitle: 'నేలలో తేమ & పొలం పరిస్థితులు',
      liveTelemetry: 'లైవ్ ఫీల్డ్ సెన్సార్ సమాచారం',
      rootMoisture: 'వేరు ప్రాంతంలో తేమ',
      goodMoisture: 'తగినంత తేమ',
      rootDepthDesc: 'వేరు లోతు: 15 సెం.మీ • ప్రస్తుతం నీరు పెట్టాల్సిన అవసరం లేదు',
      saltLevel: 'నేలలో లవణాలు / ఎరువుల స్థాయి',
      normalFertility: 'సాధారణ సారవంతం',
      saltDesc: 'సమతుల్య రసాయన మూలకాలు, వేర్లు బలంగా పెరగడానికి అనుకూలం',
      bedTemp: 'మట్టి ఉష్ణోగ్రత',
      idealRoots: 'వేర్లకు అనుకూలం',
      tempDesc: 'వానపాములు మరియు మేలుచేసే సూక్ష్మజీవులకు అనువైన వాతావరణం',
      sunlight: 'సూర్యరశ్మి & పగటి గంటలు',
      goodSun: 'మంచి ఎండ',
      sunDesc: 'కిరణజన్య సంయోగక్రియకు అవసరమైనంత వెలుతురు ఉంది',
    },
    schemes: {
      badge: 'ప్రభుత్వ రైతు సంక్షేమ పథకాలు',
      heading: 'రైతు సంక్షేమ పథకాలు & అధికారిక సహాయవాణి',
      subheading: 'రైతుల కోసం సబ్సిడీలు, పంట బీమా మరియు వడ్డీలేని రుణాల సమగ్ర సమాచారం.',
      pmKisanTitle: 'పీఎం కిసాన్ సమ్మాన్ నిధి',
      pmKisanDesc: 'రైతు కుటుంబాలకు ప్రతి ఏటా ₹6,000 ఆర్థిక సాయం (3 విడతల్లో) నేరుగా బ్యాంకు ఖాతాలో జమ.',
      pmfbyTitle: 'ప్రధానమంత్రి ఫసల్ బీమా యోజన (PMFBY)',
      pmfbyDesc: 'విత్తనం వేసినప్పటి నుండి పంట చేతికొచ్చే వరకు ప్రకృతి వైపరీత్యాలు, అకాల వర్షాల వల్ల కలిగే నష్టానికి పూర్తి బీమా రక్షణ.',
      shcTitle: 'సాయిల్ హెల్త్ కార్డ్ పథకం (Soil Health Card)',
      shcDesc: 'ప్రతి రెండేళ్లకు ఉచిత నేల పరీక్ష చేసి ఎరువుల సమతుల్య వాడకంపై సరైన సూచనలు.',
      kccTitle: 'కిసాన్ క్రెడిట్ కార్డ్ (KCC)',
      kccDesc: 'సకాలంలో చెల్లిస్తే 4% రాయితీ వడ్డీతో సులభ రుణాలు మరియు ₹1.6 లక్షల వరకు ఎలాంటి పూచీకత్తు లేని రుణం.',
      helplineTitle: 'కిసాన్ కాల్ సెంటర్ (టోల్ ఫ్రీ 24x7)',
      helplineNumber: '1800-180-1551',
      helplineDesc: 'తెలుగుతో సహా 22 భాషల్లో వ్యవసాయ శాస్త్రవేత్తల ఉచిత ఫోన్ సలహా, ఉదయం 6:00 నుండి రాత్రి 10:00 వరకు.',
      viewPortal: 'అధికారిక పోర్టల్ తెరవండి',
      callNow: 'ఇప్పుడే కాల్ చేయండి',
    },
    vault: {
      badge: 'రైతు నోట్‌బుక్ & డిజిటల్ రికార్డులు',
      heading: 'నా పంట తెగుళ్ల గుర్తింపు రికార్డులు',
      subheading: 'గతంలో గుర్తించిన తెగుళ్లు, వాడిన మందులు మరియు నేల సలహాల చరిత్రను భద్రంగా ఉంచండి.',
      totalScans: 'మొత్తం తనిఖీలు',
      activeFields: 'సాగులో ఉన్న భూములు',
      criticalCases: 'తీవ్రమైన తెగుళ్ల కేసులు',
      soilPlans: 'పంట ప్రణాళికలు',
      filterAll: 'అన్ని రికార్డులు',
      filterCritical: 'అత్యవసర సమస్యలు',
      filterHealthy: 'ఆరోగ్యకరమైన పంటలు',
      noRecords: 'ఎలాంటి రికార్డులు లేవు',
      noRecordsDesc: 'ఆకులను తనిఖీ చేసి లేదా నేల సలహాలను మీ వ్యవసాయ పుస్తకంలో భద్రపరచండి.',
      printExport: 'నివేదిక ప్రింట్ / పీడీఎఫ్ డౌన్‌లోడ్',
      scanNew: 'కొత్త ఆకును తనిఖీ చేయండి',
    },
    chatbot: {
      botLanguageLabel: 'చాట్‌బాట్ భాష (వాయిస్ & సమాధానాలు):',
      badge: 'తెలుగు కిసాన్ AI సహాయకుడు',
      title: 'కిసాన్ AI అసిస్టెంట్',
      subtitle: 'మీ మాతృభాషలోనే మాట్లాడి లేదా రాసి వ్యవసాయ ప్రశ్నలు అడగండి',
      welcome: 'నమస్కారం రైతు సోదరులారా! నేను మీ కృషి రక్షక్ వ్యవసాయ సహాయకుడిని. మీ మాతృభాషలోనే వ్యవసాయ ప్రశ్నలు అడగండి — ఆకు తెగుళ్ల మందులు, సేంద్రీయ పురుగుమందులు లేదా మార్కెట్ ధరలు.',
      inputPlaceholder: 'మీ ప్రశ్నను ఇక్కడ టైప్ చేయండి లేదా మైక్ నొక్కి మాట్లాడండి...',
      listening: 'వింటోంది... దయచేసి మాట్లాడండి...',
      speakBtn: 'వాయిస్‌లో వినండి',
      stopSpeech: 'వాయిస్ ఆపండి',
      send: 'పంపండి',
      quickPrompt1: 'యూరియా బస్తాకు ప్రత్యామ్నాయంగా ఏ ఎరువు వాడాలి?',
      quickPrompt2: 'తెలుగు రాష్ట్రాల్లో శనగ విత్తడానికి ఉత్తమ సమయం ఏది?',
      quickPrompt3: 'ఈరోజు మార్కెట్లో ఉల్లిపాయల ధర ఎలా ఉంది?',
      quickPrompt4: 'టొమాటో మచ్చల తెగులుకు మాంకోజెబ్ ఎంత మోతాదులో కలపాలి?',
      kccHelplinePrompt: 'కిసాన్ కాల్ సెంటర్ ఉచిత ఫోన్ నంబర్ ఏమిటి?',
    },
    footer: {
      aboutTitle: 'కృషి రక్షక్ గురించి',
      aboutDesc: 'కృషి రక్షక్ అనేది భారతీయ రైతుల కోసం రూపొందించబడిన 100% ఉచిత వ్యవసాయ AI సహాయకుడు. తెగుళ్ల ముందస్తు గుర్తింపు, నేల ఆధారిత పంట సలహా మరియు మార్కెట్ ధరల సమాచారాన్ని అందిస్తుంది.',
      quickLinks: 'ముఖ్యమైన లింకులు',
      schemesLink: 'రైతు పథకాలు & సహాయం',
      scannerLink: 'ఆకు డాక్టర్ (తెగుళ్ల గుర్తింపు)',
      advisorLink: 'పంట సలహాదారు (నేల ఆధారిత)',
      helplineTitle: 'అత్యవసర రైతు హెల్ప్‌లైన్',
      helplineDesc: 'టోల్ ఫ్రీ 1800-180-1551 (కిసాన్ కాల్ సెంటర్, భారత వ్యవసాయ మంత్రిత్వ శాఖ)',
      copyright: 'రైతన్నల సేవలో అంకితం • జై జవాన్, జై కిసాన్ 🌾',
    },
    auth: {
      title: 'రైతు ఖాతాలోకి లాగిన్ అవ్వండి',
      subtitle: 'మీ పొలం రికార్డులను ఎప్పటికీ భద్రంగా ఉంచుకోవడానికి లాగిన్ అవ్వండి.',
      emailLabel: 'ఈమెయిల్ చిరునామా',
      passwordLabel: 'పాస్‌వర్డ్',
      nameLabel: 'రైతు పూర్తి పేరు',
      signInBtn: 'లాగిన్ అవ్వండి',
      signUpBtn: 'కొత్త ఖాతా తెరవండి',
      googleBtn: 'గూగుల్ ఖాతాతో లాగిన్ అవ్వండి',
      or: 'లేదా',
      toggleSignUp: 'ఖాతా లేదా? కొత్త ఖాతా తెరవండి',
      toggleSignIn: 'ఇప్పటికే ఖాతా ఉందా? లాగిన్ అవ్వండి',
    },
  },

  // 6. GUJARATI (ગુજરાતી)
  gu: {
    nav: {
      home: 'મુખ્ય પૃષ્ઠ',
      leafDoctor: 'પાંદડા ડૉક્ટર',
      cropAdvisor: 'પાક સલાહકાર',
      mandiWeather: 'માર્કેટ અને હવામાન',
      askKisanAI: 'કિસાન AI ને પૂછો',
      schemes: 'ખેડૂત યોજનાઓ અને સહાય',
      vault: 'મારી ખેત નોંધપોથી',
      freeBadge: '🌾 ખેડૂતો માટે ૧૦૦% મફત',
      checkLeaf: 'પાંદડું તપાસો',
      homeBtn: 'મુખ્ય',
      voiceReadout: 'અવાજ',
      signIn: 'સાઇન ઇન',
      signOut: 'બહાર નીકળો',
      kisanCallCenter: 'કિસાન હેલ્પલાઇન ૧૮૦૦-૧૮૦-૧૫૫૧',
    },
    hero: {
      tickerAccurate: '૯૮.૪% સચોટ રોગ નિદાન ટેકનોલોજી',
      tickerDiseases: '૩૮+ પાકના રોગોની ત્વરિત ઓળખ',
      tickerMandi: 'લાઇવ APMC બજાર ભાવો',
      tickerHelpline: 'કિસાન કૉલ સેન્ટર ૧૮૦૦-૧૮૦-૧૫૫૧ (૨૪x૭)',
      badge: 'સ્માર્ટ પાક રક્ષક • ખેડૂત મિત્ર',
      headline1: 'પાકનું કરો રક્ષણ.',
      headline2: 'વધારો મબલક ઉપજ.',
      headline3: '',
      description: 'પાંદડાનો ફોટો પાડીને ૩ સેકન્ડમાં પાકના રોગની સચોટ ઓળખ અને દવા મેળવો, જમીન ચકાસણી મુજબ સૌથી વધુ નફો આપતો પાક પસંદ કરો અને આજના બજાર ભાવો જાણો.',
      btnDiagnose: 'પાંદડાનો રોગ તપાસો',
      btnCropML: 'AI દ્વારા શ્રેષ્ઠ પાક પસંદ કરો',
      stat1Val: '૩૮+',
      stat1Lbl: 'પાકના રોગો ઓળખી શકાય છે',
      stat2Val: '૯૮.૪%',
      stat2Lbl: 'સચોટ નિદાન દર',
      stat3Val: '૬ ભાષાઓ',
      stat3Lbl: 'ગુજરાતી અવાજમાં માર્ગદર્શન',
      hudCrop: 'ટામેટાનો આગોતરો સુકારો',
      hudAction: '૨ ગ્રામ મેન્કોઝેબ પ્રતિ લિટર પાણીમાં મેળવી છંટકાવ કરો',
      hudConfidence: '૯૮.૪% ચોકસાઈ',
      hudStatus: 'તાત્કાલિક પગલાં જરૂરી',
    },
    pipeline: {
      badge: 'ખેતી સમક્ષના મુખ્ય પડકારો',
      heading: 'રોગની સમયસર ઓળખ શા માટે અનિવાર્ય છે?',
      subheading: 'પાકના રોગની સમયસર ઓળખ ન થવાને કારણે દેશના ખેડૂતોને વાર્ષિક ૪૦% સુધીનું મોટું નુકસાન વેઠવું પડે છે.',
      c1Title: 'અણધાર્યું હવામાન',
      c1Desc: 'અચાનક કમોસમી વરસાદ અને વાતાવરણમાં ભેજ વધવાથી ફૂગના રોગો રાતોરાત ઝડપથી ફેલાય છે.',
      c2Title: 'રોગની મોડી ઓળખ',
      c2Desc: 'જ્યાં સુધી લક્ષણો નરી આંખે સ્પષ્ટ દેખાય ત્યાં સુધીમાં પાકનો મોટો ભાગ રોગગ્રસ્ત થઈ જાય છે.',
      c3Title: 'દવાઓનો વધુ પડતો ખર્ચ',
      c3Desc: 'સાચી માહિતી વિના મોંઘી દવાઓ છાંટવાથી ઉત્પાદન ખર્ચ અને દેવાનો બોજ વધી જાય છે.',
      c4Title: 'ભાષાની મુશ્કેલી',
      c4Desc: 'વૈજ્ઞાનિક કૃષિ સલાહ ઘણીવાર અંગ્રેજીમાં હોવાથી સ્થાનિક ખેડૂત સુધી સરળતાથી પહોંચતી નથી.',
      guideTitle: 'કૃષિ રક્ષક કેવી રીતે કાર્ય કરે છે (૪ સરળ પગલાં)',
      step1Title: '૧. પાંદડાનો ફોટો પાડો',
      step1Desc: 'મોબાઇલ કેમેરાથી રોગિષ્ઠ પાંદડાનો સ્પષ્ટ ફોટો લો અથવા ગેલેરીમાંથી અપલોડ કરો.',
      step2Title: '૨. AI દ્વારા ત્વરિત રોગ નિદાન',
      step2Desc: 'આર્ટિફિશિયલ ઇન્ટેલિજન્સ પાંદડા પર ફૂગ, નુકસાનની ટકાવારી અને ગંભીરતા દર્શાવે છે.',
      step3Title: '૩. યોગ્ય દવા અને ચોક્કસ માપ',
      step3Desc: 'ઓછા ખર્ચના કુદરતી ઉપાયો (લીમડાનું અર્ક) અને પ્રમાણિત રાસાયણિક દવાનું યોગ્ય માપ મેળવો.',
      step4Title: '૪. ગુજરાતીમાં અવાજ સાંભળો',
      step4Desc: 'આપણી માતૃભાષા ગુજરાતીમાં સલાહ સ્પષ્ટ અવાજમાં સાંભળો અને સમયસર છંટકાવ કરો.',
    },
    scanner: {
      badge: 'AI પાંદડા ડૉક્ટર',
      heading: 'પાક રોગ નિદાન અને ઉપચાર કેન્દ્ર',
      subheading: 'કોઈપણ પાકના પાંદડાનો ફોટો અપલોડ કરો અને તાત્કાલિક ચોક્કસ રોગ અને દવા વિશે જાણો.',
      samplePrompt: 'અથવા નમૂનાના પાક પસંદ કરીને જુઓ:',
      sampleTomato: 'ટામેટાનો સુકારો',
      sampleRice: 'ડાંગરનો બ્લાસ્ટ',
      samplePotato: 'બટાટાનો સુકારો',
      sampleSoybean: 'સ્વસ્થ સોયાબીન',
      dragDropText: 'પાંદડાનો ફોટો અહીં લાવો અથવા ફાઇલ પસંદ કરવા ક્લિક કરો',
      cameraBtn: 'કેમેરાથી ફોટો પાડો',
      uploadBtn: 'ફોટો અપલોડ કરો',
      analyzing: 'AI પાંદડાના કોષોનું પૃથક્કરણ કરી રહ્યું છે...',
      resultsTitle: 'રોગ નિદાન અહેવાલ અને ઉપચાર સલાહ',
      confidenceLabel: 'ચોકસાઈ',
      foliarDamage: 'પાંદડાનો અસરગ્રસ્ત ભાગ',
      severityLabel: 'ગંભીરતા સ્થિતિ',
      organicTitle: '🌿 જૈવિક અને કુદરતી ઉપાયો',
      chemicalTitle: '🧪 પ્રમાણિત રાસાયણિક દવા અને છંટકાવ માપ',
      listenAloud: 'સલાહ અવાજમાં સાંભળો',
      stopAudio: 'અવાજ બંધ કરો',
      fieldNameLabel: 'ખેતર / પ્લોટનું નામ',
      fieldNamePlaceholder: 'દા.ત. કુવા વાળું ખેતર #૧',
      saveToVault: 'ખેત નોંધપોથીમાં સાચવો',
      savedSuccess: 'નોંધપોથીમાં સુરક્ષિત રીતે સચવાઈ ગયું!',
      saving: 'સાચવી રહ્યા છીએ...',
      shareReport: 'નિદાન અહેવાલ શેર કરો',
      criticalBadge: 'ગંભીર રોગ',
      warningBadge: 'સાવચેતી જરૂરી',
      healthyBadge: 'સંપૂર્ણ સ્વસ્થ',
    },
    cropML: {
      badge: 'કૃષિ ભલામણ એન્જિન',
      heading: 'જમીન ચકાસણી અને મહત્તમ નફો આપતો પાક',
      subheading: 'તમારી જમીન ચકાસણીના આંકડા (NPK, pH) દાખલ કરીને સૌથી વધુ આવક આપતો પાક પસંદ કરો.',
      presetsLabel: 'વિસ્તાર મુજબ જમીનના આંકડા પસંદ કરો:',
      presetPunjab: 'પંજાબ (ઘઉંનો વિસ્તાર)',
      presetKarnataka: 'કર્ણાટક (રવિ પાક)',
      presetBengal: 'બંગાળ (ડાંગરની ખેતી)',
      presetGujarat: 'ગુજરાત (કાળી કપાસની જમીન)',
      nitrogen: 'નાઇટ્રોજન (N) કિગ્રા/હેક્ટર',
      phosphorus: 'ફોસ્ફરસ (P) કિગ્રા/હેક્ટર',
      potassium: 'પોટાશ (K) કિગ્રા/હેક્ટર',
      ph: 'જમીનનો pH આંક',
      temperature: 'તાપમાન (°C)',
      humidity: 'ભેજનું પ્રમાણ (%)',
      rainfall: 'વાર્ષિક વરસાદ (મીમી)',
      predictBtn: 'યોગ્ય પાકની ભલામણ મેળવો',
      calculating: 'જમીનનું પૃથક્કરણ ચાલુ છે...',
      resultTitle: 'ભલામણ કરેલ પાક અને ઉત્પાદન વિગતો',
      yieldPotential: 'અપેક્ષિત ઉત્પાદન',
      mspRate: 'ટેકાનો લઘુત્તમ ભાવ (MSP)',
      waterDemand: 'પાણીની જરૂરિયાત',
      netMargin: 'અંદાજિત ચોખ્ખો નફો',
      altCrop: 'વૈકલ્પિક પાકનો વિકલ્પ',
      rationale: 'વૈજ્ઞાનિક કારણ',
      askAI: 'કિસાન AI ને આ પાક વિશે પૂછો',
    },
    telemetry: {
      badge: 'લાઇવ ખેતી માહિતી',
      heading: 'APMC બજાર ભાવ અને હવામાન ચેતવણી',
      subheading: 'ગુજરાત અને દેશની મુખ્ય માર્કેટિંગ યાર્ડના તાજા ભાવો અને ફૂગના રોગોનું જોખમ.',
      mandiTableTitle: 'આજના માર્કેટિંગ યાર્ડના ભાવો',
      colCommodity: 'પાક / જણસ',
      colVariety: 'જાત',
      colMandi: 'માર્કેટિંગ યાર્ડ',
      colState: 'રાજ્ય',
      colPrice: 'મોડલ ભાવ (₹/ક્વિન્ટલ)',
      colTrend: '૨૪ કલાકનું વલણ',
      sporeTitle: 'ફૂગ રોગ અને બીજાણુ ચેતવણી',
      sporeBadge: 'વધુ પડતા ભેજની ચેતવણી',
      riskIndex: 'રોગ જોખમ આંક',
      sporeWarning: 'સવારે પડતું ધુમ્મસ અને પાંદડા પર ૧૪ કલાકથી વધુ સમય ભેજ રહેવાથી સુકારો અને ગેરુ રોગ ફેલાવાની શક્યતા વધુ છે.',
      sporeRemedy: 'વરસાદ આવે તે પહેલાં લીમડાનું અર્ક અથવા કોપર ફૂગનાશકનો છંટકાવ કરવો.',
      soilHealthTitle: 'જમીનનો ભેજ અને ખેતરની સ્થિતિ',
      liveTelemetry: 'લાઇવ ખેતર સેન્સર માહિતી',
      rootMoisture: 'મૂળ વિસ્તારનો ભેજ',
      goodMoisture: 'યોગ્ય ભેજ',
      rootDepthDesc: 'મૂળની ઊંડાઈ: ૧૫ સેમી • હાલ પિયત આપવાની જરૂર નથી',
      saltLevel: 'જમીનમાં ક્ષાર / ખાતરનું પ્રમાણ',
      normalFertility: 'સામાન્ય ફળદ્રુપતા',
      saltDesc: 'સંતુલિત રાસાયણિક તત્વો, મૂળના વિકાસ માટે સલામત',
      bedTemp: 'જમીનનું તાપમાન',
      idealRoots: 'મૂળ માટે ઉત્તમ',
      tempDesc: 'અળસિયા અને ઉપયોગી સૂક્ષ્મજીવાણુઓ માટે અનુકૂળ',
      sunlight: 'સૂર્યપ્રકાશ અને દિવસના કલાકો',
      goodSun: 'પુરતો તડકો',
      sunDesc: 'પ્રકાશસંશ્લેષણ ક્રિયા માટે પૂરતો સૂર્યપ્રકાશ ઉપલબ્ધ',
    },
    schemes: {
      badge: 'સરકારી ખેડૂત કલ્યાણ યોજનાઓ',
      heading: 'સરકારી ખેડૂત યોજનાઓ અને સહાયતા કેન્દ્ર',
      subheading: 'ખેડૂતો માટે સરકારી સબસિડી, પાક વીમો અને રાહત દરે ધિરાણ યોજનાઓની સંપૂર્ણ માહિતી.',
      pmKisanTitle: 'પીએમ કિસાન સન્માન નિધિ',
      pmKisanDesc: 'પાત્ર ખેડૂત પરિવારોને દર વર્ષે ₹૬,૦૦૦ ની સીધી સહાય (૩ સમાન હપ્તામાં) સીધી બેંક ખાતામાં.',
      pmfbyTitle: 'પ્રધાનમંત્રી ફસલ બીમા યોજના (PMFBY)',
      pmfbyDesc: 'વાવણીથી લઈને લણણી સુધી કુદરતી આફતો, દુષ્કાળ અને અતિવૃષ્ટિથી થતા નુકસાન સામે સંપૂર્ણ વીમા કવચ.',
      shcTitle: 'સોઇલ હેલ્થ કાર્ડ યોજના (Soil Health Card)',
      shcDesc: 'દર ૨ વર્ષે જમીનની મફત ચકાસણી જેથી ખાતરોનો સંતુલિત અને કરકસરભર્યો ઉપયોગ કરી શકાય.',
      kccTitle: 'કિસાન ક્રેડિટ કાર્ડ (KCC)',
      kccDesc: 'સમયસર ભરપાઈ કરવા પર ૪% ના રાહત દરે કૃષિ ધિરાણ અને ₹૧.૬ લાખ સુધી કોઈપણ જામીન વગર લોન.',
      helplineTitle: 'કિસાન કૉલ સેન્ટર (ટોલ ફ્રી ૨૪x૭)',
      helplineNumber: '૧૮૦૦-૧૮૦-૧૫૫૧',
      helplineDesc: 'ગુજરાતી સહિત ૨૨ ભાષાઓમાં કૃષિ વૈજ્ઞાનિકો પાસેથી ફોન પર મફત સલાહ, સવારે ૬:૦૦ થી રાત્રે ૧૦:૦૦.',
      viewPortal: 'સત્તાવાર પોર્ટલ ખોલો',
      callNow: 'હમણાં જ કૉલ કરો',
    },
    vault: {
      badge: 'ખેત નોંધપોથી અને ડિજિટલ રેકોર્ડ',
      heading: 'મારા ખેતરના રોગ નિદાનના રેકોર્ડ',
      subheading: 'અગાઉ તપાસેલા પાંદડા, છાંટેલી દવાઓ અને જમીન ભલામણોનો ઈતિહાસ સુરક્ષિત રાખો.',
      totalScans: 'કુલ તપાસણી',
      activeFields: 'ચાલુ ખેતરો',
      criticalCases: 'ગંભીર રોગના કિસ્સા',
      soilPlans: 'પાક યોજનાઓ',
      filterAll: 'બધા રેકોર્ડ',
      filterCritical: 'તાત્કાલિક સમસ્યાઓ',
      filterHealthy: 'સ્વસ્થ પાક',
      noRecords: 'કોઈ રેકોર્ડ મળ્યા નથી',
      noRecordsDesc: 'પાંદડાની તપાસ કરો અથવા જમીનની ભલામણ મેળવીને તમારી નોંધપોથીમાં સાચવો.',
      printExport: 'અહેવાલ પ્રિન્ટ / પીડીએફ ડાઉનલોડ',
      scanNew: 'નવું પાંદડું તપાસો',
    },
    chatbot: {
      botLanguageLabel: 'ચેટબૉટની ભાષા (અવાજ અને જવાબો):',
      badge: 'ગુજરાતી કિસાન AI સહાયક',
      title: 'કિસાન AI સહાયક',
      subtitle: 'આપણી માતૃભાષામાં બોલીને અથવા લખીને ખેતીના પ્રશ્નો પૂછો',
      welcome: 'નમસ્તે ખેડૂત મિત્રો! હું આપનો કૃષિ રક્ષક સાથી છું. આપની ભાષામાં ખેતી સંબંધિત કોઈપણ પ્રશ્ન પૂછો — પાંદડાના રોગની દવા, જૈવિક કીટનાશક, વાવણીની સલાહ અથવા આજના મંડી ભાવ.',
      inputPlaceholder: 'આપનો પ્રશ્ન અહીં લખો અથવા માઇક દબાવીને બોલો...',
      listening: 'સાંભળી રહ્યા છીએ... કૃપા કરીને બોલો...',
      speakBtn: 'અવાજમાં સાંભળો',
      stopSpeech: 'અવાજ બંધ કરો',
      send: 'મોકલો',
      quickPrompt1: 'યુરિયાની એક ગુણીના બદલે કયું કુદરતી ખાતર વાપરવું?',
      quickPrompt2: 'ગુજરાતમાં ચણાની વાવણી માટે ઉત્તમ સમય કયો છે?',
      quickPrompt3: 'આજે રાજકોટ અથવા ગોંડલ યાર્ડમાં કપાસનો શું ભાવ છે?',
      quickPrompt4: 'ટામેટાના આગોતરા સુકારા માટે મેન્કોઝેબ કેટલું નાખવું?',
      kccHelplinePrompt: 'કિસાન કૉલ સેન્ટરનો ટોલ-ફ્રી નંબર શું છે?',
    },
    footer: {
      aboutTitle: 'કૃષિ રક્ષક વિશે',
      aboutDesc: 'કૃષિ રક્ષક એ ભારતીય ખેડૂતો માટે ૧૦૦% મફત AI કૃષિ સહાયક છે. પાકના રોગોનું ઝડપી નિદાન, જમીન મુજબ પાકની ભલામણ અને માર્કેટિંગ યાર્ડના તાજા ભાવો પહોંચાડવાનો અમારો ઉદ્દેશ્ય છે.',
      quickLinks: 'ઝડપી લિંક્સ',
      schemesLink: 'ખેડૂત યોજનાઓ અને સહાય',
      scannerLink: 'પાંદડા ડૉક્ટર (રોગ નિદાન)',
      advisorLink: 'પાક સલાહકાર (જમીન ML)',
      helplineTitle: 'ઇમરજન્સી ખેડૂત હેલ્પલાઇન',
      helplineDesc: 'ટોલ ફ્રી ૧૮૦૦-૧૮૦-૧૫૫૧ (કિસાન કૉલ સેન્ટર, કૃષિ અને ખેડૂત કલ્યાણ મંત્રાલય, ભારત સરકાર)',
      copyright: 'ભારતીય ખેડૂતોના ચરણોમાં સમર્પિત • જય જવાન, જય કિસાન 🌾',
    },
    auth: {
      title: 'ખેડૂત ખાતામાં લૉગ ઇન કરો',
      subtitle: 'તમારા ખેતરના તમામ રેકોર્ડ સુરક્ષિત રાખવા માટે લૉગ ઇન કરો.',
      emailLabel: 'ઇમેઇલ સરનામું',
      passwordLabel: 'પાસવર્ડ',
      nameLabel: 'ખેડૂતનું પૂરું નામ',
      signInBtn: 'લૉગ ઇન કરો',
      signUpBtn: 'નવું ખાતું ખોલો',
      googleBtn: 'ગૂગલ એકાઉન્ટથી લૉગ ઇન કરો',
      or: 'અથવા',
      toggleSignUp: 'ખાતું નથી? નવું ખાતું બનાવો',
      toggleSignIn: 'પહેલેથી ખાતું છે? લૉગ ઇન કરો',
    },
  },
};

interface LanguageContextType {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: Translations;
  currentLanguageMeta: LanguageMeta;
  supportedLanguages: LanguageMeta[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem('krishi_app_language');
      if (saved && (['en', 'hi', 'mr', 'kn', 'te', 'gu'] as string[]).includes(saved)) {
        return saved as AppLanguage;
      }
    } catch {
      // storage unavailable
    }
    return 'hi'; // Default to Hindi as per farmer accessibility
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('krishi_app_language', lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const currentLanguageMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentLanguageMeta,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
