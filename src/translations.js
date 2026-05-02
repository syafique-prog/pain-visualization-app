const translations = {
  en: {
    // General
    appTitle: "Pain Questionnaire",
    appDesc: "This tool helps you describe your pain visually.",
    start: "Start",
    next: "Next →",
    back: "← Back",
    seeSummary: "See Summary →",
    startAgain: "🔄 Start Again",

    // HeadSelector
    whereDoesItHurt: "Where does it hurt?",
    selectArea: "Tap the area on the head",
    selected: "Selected",
    tapToSelect: "Tap a region to select",

    // Regions
    forehead: "Forehead",
    left_temple: "Left Temple",
    right_temple: "Right Temple",
    top_of_head: "Top of Head",
    back_of_head: "Back of Head",
    around_eyes: "Around Eyes",

    // PainTypeSelector
    whatKindOfPain: "What kind of pain is it?",
    selectType: "Select the type that feels closest",
    tapPainType: "Tap a pain type to select",

    // Pain types
    throbbing: "Throbbing",
    stabbing: "Stabbing",
    pressure: "Pressure",
    burning: "Burning",
    electric: "Electric",
    hollow: "Hollow",

    // Pain type descriptions
    throbbing_desc: "Pulsing, beating pain",
    stabbing_desc: "Sharp, sudden pain",
    pressure_desc: "Squeezing, heavy feeling",
    burning_desc: "Hot, stinging sensation",
    electric_desc: "Shooting, tingling pain",
    hollow_desc: "Empty, dull ache",

    // IntensitySlider
    howIntense: "How intense is the pain?",
    dragSlider: "Drag the slider to rate your pain",
    noPain: "1 — No pain",
    worstPain: "10 — Worst pain",
    mild: "Mild",
    moderate: "Moderate",
    severe: "Severe",
    verySevere: "Very Severe",

    // SummaryCard
    painSummary: "Pain Summary",
    reviewShare: "Review and share with your interpreter",
    painLocation: "📍 Pain Location",
    painType: "Pain Type",
    intensity: "🔢 Intensity",
    suggestedPhrase: "💬 Suggested phrase for interpreter",
    summaryPhrase: (location, type, intensity, label) =>
      `The patient has ${label.toLowerCase()} ${type} pain in the ${location}, rated ${intensity} out of 10.`,
  },

  ko: {
    // General
    appTitle: "통증 문진표",
    appDesc: "이 도구는 통증을 시각적으로 표현하는 데 도움을 줍니다.",
    start: "시작",
    next: "다음 →",
    back: "← 뒤로",
    seeSummary: "요약 보기 →",
    startAgain: "🔄 다시 시작",

    // HeadSelector
    whereDoesItHurt: "어디가 아프신가요?",
    selectArea: "아픈 부위를 눌러주세요",
    selected: "선택됨",
    tapToSelect: "부위를 눌러 선택하세요",

    // Regions
    forehead: "이마",
    left_temple: "왼쪽 관자놀이",
    right_temple: "오른쪽 관자놀이",
    top_of_head: "정수리",
    back_of_head: "뒤통수",
    around_eyes: "눈 주변",

    // PainTypeSelector
    whatKindOfPain: "어떤 종류의 통증인가요?",
    selectType: "가장 비슷한 통증 유형을 선택하세요",
    tapPainType: "통증 유형을 눌러 선택하세요",

    // Pain types
    throbbing: "욱신거림",
    stabbing: "찌르는 듯한 통증",
    pressure: "압박감",
    burning: "타는 듯한 통증",
    electric: "전기 오는 듯한 통증",
    hollow: "둔한 통증",

    // Pain type descriptions
    throbbing_desc: "두근거리고 욱신거리는 느낌",
    stabbing_desc: "날카롭고 갑작스러운 통증",
    pressure_desc: "짓누르는 듯한 무거운 느낌",
    burning_desc: "뜨겁고 따가운 느낌",
    electric_desc: "전기가 오는 듯한 통증",
    hollow_desc: "텅 빈 듯한 둔한 통증",

    // IntensitySlider
    howIntense: "통증이 얼마나 심한가요?",
    dragSlider: "슬라이더를 움직여 통증 강도를 선택하세요",
    noPain: "1 — 통증 없음",
    worstPain: "10 — 극심한 통증",
    mild: "약함",
    moderate: "보통",
    severe: "심함",
    verySevere: "매우 심함",

    // SummaryCard
    painSummary: "통증 요약",
    reviewShare: "통역사와 함께 확인하세요",
    painLocation: "📍 통증 부위",
    painType: "통증 유형",
    intensity: "🔢 강도",
    suggestedPhrase: "💬 통역사를 위한 표현",
    summaryPhrase: (location, type, intensity, label) =>
      `환자는 ${location}에 ${type} 통증이 있으며, 강도는 10점 만점에 ${intensity}점 (${label})입니다.`,
  },

  ms: {
    // General
    appTitle: "Borang Kesakitan",
    appDesc: "Alat ini membantu anda menerangkan kesakitan secara visual.",
    start: "Mula",
    next: "Seterusnya →",
    back: "← Kembali",
    seeSummary: "Lihat Ringkasan →",
    startAgain: "🔄 Mulakan Semula",

    // HeadSelector
    whereDoesItHurt: "Di mana yang sakit?",
    selectArea: "Ketik kawasan pada kepala",
    selected: "Dipilih",
    tapToSelect: "Ketik kawasan untuk memilih",

    // Regions
    forehead: "Dahi",
    left_temple: "Pelipis Kiri",
    right_temple: "Pelipis Kanan",
    top_of_head: "Atas Kepala",
    back_of_head: "Belakang Kepala",
    around_eyes: "Sekitar Mata",

    // PainTypeSelector
    whatKindOfPain: "Apakah jenis kesakitan?",
    selectType: "Pilih jenis yang paling hampir",
    tapPainType: "Ketik jenis kesakitan untuk memilih",

    // Pain types
    throbbing: "Berdenyut",
    stabbing: "Menusuk",
    pressure: "Tekanan",
    burning: "Terbakar",
    electric: "Elektrik",
    hollow: "Samar",

    // Pain type descriptions
    throbbing_desc: "Sakit yang berdenyut-denyut",
    stabbing_desc: "Sakit yang tajam dan tiba-tiba",
    pressure_desc: "Rasa tertekan dan berat",
    burning_desc: "Rasa panas dan pedih",
    electric_desc: "Rasa seperti terkena elektrik",
    hollow_desc: "Sakit yang samar dan tumpul",

    // IntensitySlider
    howIntense: "Seberapa teruk kesakitan itu?",
    dragSlider: "Seret gelangsar untuk menilai kesakitan anda",
    noPanel: "1 — Tiada sakit",
    worstPain: "10 — Sakit paling teruk",
    mild: "Ringan",
    moderate: "Sederhana",
    severe: "Teruk",
    verySevere: "Sangat Teruk",

    // SummaryCard
    painSummary: "Ringkasan Kesakitan",
    reviewShare: "Semak dan kongsi dengan jurubahasa anda",
    painLocation: "📍 Lokasi Kesakitan",
    painType: "Jenis Kesakitan",
    intensity: "🔢 Intensiti",
    suggestedPhrase: "💬 Frasa cadangan untuk jurubahasa",
    summaryPhrase: (location, type, intensity, label) =>
      `Pesakit mengalami kesakitan ${type} yang ${label.toLowerCase()} di ${location}, dinilai ${intensity} daripada 10.`,
  },
};

export default translations;