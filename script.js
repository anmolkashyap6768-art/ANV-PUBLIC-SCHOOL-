
document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // Important: declare these before applying the saved language.
  let currentLanguage = "hi";
  let selectedClass = "";

  const languageSelect = $("#languageSelect");
  const selectedPanel = $("#selectedClassPanel");
  const selectedTitle = $("#selectedClassTitle");
  const requestedClass = $("#requestedClass");
  const formStatus = $("#formStatus");

  // Copyright year
  const year = $("#copyrightYear");
  if (year) year.textContent = new Date().getFullYear();

  const translations = {
    hi: {
      announcement: "✨ सीखें, बढ़ें और अपने सपनों को उड़ान दें!",
      schoolLabel: "पब्लिक स्कूल",
      navHome: "होम", navAbout: "हमारे बारे में",
      navClasses: "कक्षाएँ", navVideo: "प्रेरणा वीडियो",
      navGallery: "गैलरी", navAdmission: "प्रवेश पूछताछ",
      heroEyebrow: "एक नई शुरुआत, अनगिनत संभावनाएँ",
      heroTitle: "छोटे कदम, बड़े सपने!",
      heroText: "बच्चों के सीखने, सोचने और आगे बढ़ने की यात्रा में आपका स्वागत है।",
      heroButton: "प्रवेश के लिए संपर्क करें →",
      exploreButton: "कक्षाएँ देखें",
      heroLocation: "गजरौला, उत्तर प्रदेश",
      heroArtTitle: "सीखना है मज़ेदार!",
      heroArtText: "हर दिन कुछ नया",
      chipDream: "बड़े सपने", chipCreate: "रचनात्मकता",
      factClasses: "कक्षाएँ उपलब्ध",
      factTiming: "सोमवार से शनिवार",
      factLocationTitle: "गजरौला",
      factLocation: "उत्तर प्रदेश, भारत",
      aboutKicker: "हमारा विद्यालय",
      aboutTitle: "हर बच्चे में है एक खास प्रतिभा",
      aboutText: "हमारा उद्देश्य बच्चों के लिए सीखने की एक सकारात्मक और उत्साहपूर्ण शुरुआत को बढ़ावा देना है।",
      valueOneTitle: "जिज्ञासा",
      valueOneText: "सवाल पूछने और नई चीजें सीखने की आदत को प्रोत्साहित करें।",
      valueTwoTitle: "रचनात्मकता",
      valueTwoText: "कल्पना, कला और नए विचारों के लिए जगह बनाएँ।",
      valueThreeTitle: "अच्छे संस्कार",
      valueThreeText: "दयालुता, सम्मान और मिल-जुलकर काम करने की सीख।",
      classesKicker: "सीखने का सफर",
      classesTitle: "अपनी कक्षा चुनें",
      classesText: "किसी भी कक्षा पर टैप करें और प्रवेश पूछताछ के लिए आगे बढ़ें।",
      classNursery: "नर्सरी", classLKG: "एलकेजी",
      classUKG: "यूकेजी", class1: "कक्षा 1",
      class2: "कक्षा 2", class3: "कक्षा 3",
      class4: "कक्षा 4", class5: "कक्षा 5",
      classExplore: "कक्षा चुनें ↗",
      selectedClassLabel: "आपने चुना है",
      selectedClassText: "इस कक्षा में प्रवेश के बारे में पूछताछ करें।",
      askAdmission: "पूछताछ करें →",
      videoKicker: "छोटी कहानी, बड़ी सीख",
      videoTitle: "सीखो, कोशिश करो और आगे बढ़ो!",
      videoText: "प्रेरणादायक कहानियों से बच्चे मेहनत, दयालुता और हिम्मत की अहमियत सीख सकते हैं।",
      lessonOne: "💪 मेहनत", lessonTwo: "💛 दयालुता",
      lessonThree: "🌱 आत्मविश्वास",
      videoNote: "वीडियो YouTube पर उपलब्ध हैं। बच्चों को दिखाने से पहले अभिभावक वीडियो की सामग्री जाँच लें।",
      englishVideoButton: "🇬🇧 English वीडियो खोजें ↗",
      videoLabel: "प्रेरणादायक कहानी",
      videoCardTitle: "बच्चों की हिंदी कहानियाँ",
      videoCardText: "YouTube पर देखें",
      galleryKicker: "रंग और कल्पना",
      galleryTitle: "सीखने की रंगीन दुनिया",
      galleryText: "यह चित्रों पर आधारित गैलरी है, वास्तविक स्कूल की तस्वीरें नहीं।",
      galleryOne: "किताबों की दुनिया",
      galleryTwo: "रंगों के साथ सीखें",
      galleryThree: "प्रकृति से सीखें",
      galleryFour: "सोचें और हल करें",
      admissionKicker: "हमसे बात करें",
      admissionTitle: "आपके बच्चे के सफर की शुरुआत यहीं से करें",
      admissionText: "प्रवेश संबंधी जानकारी के लिए फोन करें या WhatsApp पर संपर्क करें।",
      callLabel: "फोन करें",
      whatsappLabel: "संदेश भेजें",
      addressLabel: "विद्यालय का पता",
      addressText: "ग्राम नगालिया मेव, गजरौला, पखरौला हाशमपुर, उत्तर प्रदेश 244225",
      hoursTitle: "विद्यालय का समय",
      hoursText: "सोमवार–शनिवार: सुबह 8:00 से दोपहर 1:00 बजे तक · रविवार बंद",
      formTitle: "प्रवेश संबंधी पूछताछ",
      formSubtitle: "नीचे अपनी जानकारी भरें।",
      parentLabel: "अभिभावक का नाम *",
      parentPlaceholder: "अपना नाम लिखें",
      childLabel: "बच्चे का नाम *",
      childPlaceholder: "बच्चे का नाम लिखें",
      classLabel: "किस कक्षा में प्रवेश चाहिए? *",
      classPlaceholder: "कक्षा चुनें",
      phoneLabel: "मोबाइल नंबर *",
      phonePlaceholder: "10 अंकों का मोबाइल नंबर",
      messageLabel: "संदेश (वैकल्पिक)",
      messagePlaceholder: "अपना सवाल लिखें",
      submitButton: "WhatsApp पर enquiry भेजें ↗",
      formPrivacy: "यह फॉर्म जानकारी को database में सेव नहीं करता। WhatsApp खुलेगा, जहाँ आप संदेश जाँचकर स्वयं भेज सकते हैं।",
      finalTitle: "हर बड़ा सपना एक छोटे कदम से शुरू होता है!",
      finalText: "विद्यालय के बारे में अधिक जानने के लिए आज ही संपर्क करें।",
      finalButton: "अभी संपर्क करें",
      footerAddress: "गजरौला, उत्तर प्रदेश 244225",
      copyrightText: "सर्वाधिकार सुरक्षित।",
      formSuccess: "WhatsApp खुल रहा है। संदेश जाँचकर Send दबाएँ।",
      formError: "कृपया सभी जरूरी जानकारी सही तरीके से भरें।",
      galleryDescriptions: [
        "किताबें बच्चों को नई जानकारी और कल्पना की दुनिया से जोड़ती हैं।",
        "चित्रकारी और रंग बच्चों की रचनात्मकता को बढ़ावा देते हैं।",
        "प्रकृति को देखकर बच्चे अपने आसपास की दुनिया को समझ सकते हैं।",
        "पहेलियाँ और खेल बच्चों को सोचने और समस्याएँ हल करने के लिए प्रेरित करते हैं।"
      ],
      classNames: {
        Nursery: "नर्सरी", LKG: "एलकेजी", UKG: "यूकेजी",
        "Class 1": "कक्षा 1", "Class 2": "कक्षा 2",
        "Class 3": "कक्षा 3", "Class 4": "कक्षा 4",
        "Class 5": "कक्षा 5"
      }
    },

    en: {
      announcement: "✨ Learn, grow and let your dreams take flight!",
      schoolLabel: "Public School",
      navHome: "Home", navAbout: "About Us",
      navClasses: "Classes", navVideo: "Motivational Video",
      navGallery: "Gallery", navAdmission: "Admission Enquiry",
      heroEyebrow: "A fresh start, endless possibilities",
      heroTitle: "Little Steps, Big Dreams!",
      heroText: "Welcome to a journey of learning, curiosity and growth for children.",
      heroButton: "Contact for Admission →",
      exploreButton: "Explore Classes",
      heroLocation: "Gajraula, Uttar Pradesh",
      heroArtTitle: "Learning is Fun!",
      heroArtText: "Something new every day",
      chipDream: "Big Dreams", chipCreate: "Creativity",
      factClasses: "Classes available",
      factTiming: "Monday to Saturday",
      factLocationTitle: "Gajraula",
      factLocation: "Uttar Pradesh, India",
      aboutKicker: "Our School",
      aboutTitle: "Every Child Has a Special Talent",
      aboutText: "Our aim is to encourage a positive and enthusiastic beginning to children's learning journey.",
      valueOneTitle: "Curiosity",
      valueOneText: "Encouraging children to ask questions and discover new things.",
      valueTwoTitle: "Creativity",
      valueTwoText: "Making room for imagination, art and new ideas.",
      valueThreeTitle: "Good Values",
      valueThreeText: "Learning kindness, respect and working together.",
      classesKicker: "Learning Journey",
      classesTitle: "Choose Your Class",
      classesText: "Tap a class to select it and continue to the admission enquiry.",
      classNursery: "Nursery", classLKG: "LKG",
      classUKG: "UKG", class1: "Class 1",
      class2: "Class 2", class3: "Class 3",
      class4: "Class 4", class5: "Class 5",
      classExplore: "Select class ↗",
      selectedClassLabel: "You selected",
      selectedClassText: "Enquire about admission for this class.",
      askAdmission: "Make an Enquiry →",
      videoKicker: "A Little Story, A Big Lesson",
      videoTitle: "Learn, Try and Keep Moving Forward!",
      videoText: "Inspirational stories can help children appreciate effort, kindness and courage.",
      lessonOne: "💪 Effort", lessonTwo: "💛 Kindness",
      lessonThree: "🌱 Confidence",
      videoNote: "Videos are hosted on YouTube. Parents should review their content before showing them to children.",
      englishVideoButton: "🇬🇧 Find English Videos ↗",
      videoLabel: "Inspirational Story",
      videoCardTitle: "Hindi Stories for Children",
      videoCardText: "Watch on YouTube",
      galleryKicker: "Colour & Imagination",
      galleryTitle: "A Colourful World of Learning",
      galleryText: "This is an illustrated gallery, not a collection of real school photographs.",
      galleryOne: "The World of Books",
      galleryTwo: "Learn Through Colours",
      galleryThree: "Discover Nature",
      galleryFour: "Think and Solve",
      admissionKicker: "Talk to Us",
      admissionTitle: "Start Your Child's Journey Here",
      admissionText: "For admission information, call us or contact us on WhatsApp.",
      callLabel: "Call us",
      whatsappLabel: "Send a message",
      addressLabel: "School Address",
      addressText: "Village Nagaliya Mev, Gajraula, Pakhroula Hashampur, Uttar Pradesh 244225",
      hoursTitle: "School Hours",
      hoursText: "Monday–Saturday: 8:00 AM to 1:00 PM · Sunday closed",
      formTitle: "Admission Enquiry",
      formSubtitle: "Fill in your details below.",
      parentLabel: "Parent's Name *",
      parentPlaceholder: "Enter your name",
      childLabel: "Child's Name *",
      childPlaceholder: "Enter child's name",
      classLabel: "Which class are you interested in? *",
      classPlaceholder: "Choose a class",
      phoneLabel: "Mobile Number *",
      phonePlaceholder: "10-digit mobile number",
      messageLabel: "Message (optional)",
      messagePlaceholder: "Write your question",
      submitButton: "Send Enquiry on WhatsApp ↗",
      formPrivacy: "This form does not save data to a database. WhatsApp will open so you can review and send the message yourself.",
      finalTitle: "Every Big Dream Begins with a Small Step!",
      finalText: "Contact us today to learn more about the school.",
      finalButton: "Contact Us",
      footerAddress: "Gajraula, Uttar Pradesh 244225",
      copyrightText: "All rights reserved.",
      formSuccess: "WhatsApp is opening. Review the message and press Send.",
      formError: "Please enter all required details correctly.",
      galleryDescriptions: [
        "Books can connect children with new knowledge and imagination.",
        "Drawing and colours can encourage children's creativity.",
        "Observing nature helps children understand the world around them.",
        "Puzzles and games encourage children to think and solve problems."
      ],
      classNames: {
        Nursery: "Nursery", LKG: "LKG", UKG: "UKG",
        "Class 1": "Class 1", "Class 2": "Class 2",
        "Class 3": "Class 3", "Class 4": "Class 4",
        "Class 5": "Class 5"
      }
    }
  };

  function updateSelectedClass(classValue) {
    if (!selectedPanel || !selectedTitle) return;

    const words = translations[currentLanguage];
    selectedTitle.textContent =
      words.classNames[classValue] || classValue;

    selectedPanel.hidden = false;
  }

  function applyLanguage(language) {
    currentLanguage = translations[language] ? language : "hi";
    const words = translations[currentLanguage];

    document.documentElement.lang = currentLanguage;

    $$("[data-i18n]").forEach(element => {
      const key = element.dataset.i18n;
      if (typeof words[key] === "string") {
        element.textContent = words[key];
      }
    });

    $$("[data-i18n-placeholder]").forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      if (typeof words[key] === "string") {
        element.placeholder = words[key];
      }
    });

    // Translate class dropdown labels but preserve values.
    if (requestedClass) {
      $$("option", requestedClass).forEach(option => {
        if (!option.value) {
          option.textContent = words.classPlaceholder;
        } else if (words.classNames[option.value]) {
          option.textContent = words.classNames[option.value];
        }
      });
    }

    if (languageSelect) languageSelect.value = currentLanguage;

    if (selectedClass) updateSelectedClass(selectedClass);

    // Update gallery dialog language if it is open.
    const openDialog = $("#galleryDialog");
    if (openDialog && openDialog.open) {
      const activeGallery = Number(openDialog.dataset.activeGallery);
      const gallery = galleryItems[activeGallery];
      if (gallery) {
        $("#galleryDialogTitle").textContent = words[gallery.key];
        $("#galleryDialogDescription").textContent =
          words.galleryDescriptions[gallery.index];
      }
    }

    try {
      localStorage.setItem("anvWebsiteLanguage", currentLanguage);
    } catch (error) {}
  }

  // Apply saved language.
  let savedLanguage = "hi";
  try {
    savedLanguage = localStorage.getItem("anvWebsiteLanguage") || "hi";
  } catch (error) {}

  applyLanguage(savedLanguage);

  if (languageSelect) {
    languageSelect.addEventListener("change", event => {
      applyLanguage(event.target.value);
    });
  }

  // Mobile menu
  const menuToggle = $("#menuToggle");
  const primaryNav = $("#primaryNav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });

    $$("#primaryNav a").forEach(link => {
      link.addEventListener("click", () => {
        primaryNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Scroll animations
  const revealElements = $$(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add("visible"));
  }

  // Class selection
  $$(".class-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedClass = card.dataset.class || "";

      if (requestedClass) requestedClass.value = selectedClass;

      updateSelectedClass(selectedClass);

      if (selectedPanel) {
        selectedPanel.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }
    });
  });

  const selectedCTA = $("#selectedClassCTA");

  if (selectedCTA) {
    selectedCTA.addEventListener("click", () => {
      if (requestedClass && selectedClass) {
        requestedClass.value = selectedClass;
      }
    });
  }

  if (requestedClass) {
    requestedClass.addEventListener("change", () => {
      selectedClass = requestedClass.value;

      if (selectedClass) updateSelectedClass(selectedClass);
      else if (selectedPanel) selectedPanel.hidden = true;
    });
  }

  // Gallery popup
  const galleryItems = [
    { icon: "📚", key: "galleryOne", index: 0 },
    { icon: "🎨", key: "galleryTwo", index: 1 },
    { icon: "🪴", key: "galleryThree", index: 2 },
    { icon: "🧩", key: "galleryFour", index: 3 }
  ];

  const galleryDialog = $("#galleryDialog");
  const dialogArt = $("#dialogArt");
  const dialogTitle = $("#galleryDialogTitle");
  const dialogDescription = $("#galleryDialogDescription");

  $$("[data-gallery]").forEach(button => {
    button.addEventListener("click", () => {
      const item = galleryItems[Number(button.dataset.gallery)];
      if (!item || !galleryDialog) return;

      const words = translations[currentLanguage];

      dialogArt.textContent = item.icon;
      dialogTitle.textContent = words[item.key];
      dialogDescription.textContent =
        words.galleryDescriptions[item.index];

      galleryDialog.dataset.activeGallery = String(item.index);

      if (typeof galleryDialog.showModal === "function") {
        galleryDialog.showModal();
      } else {
        galleryDialog.setAttribute("open", "");
      }
    });
  });

  const closeGallery = $("#closeGallery");

  if (closeGallery && galleryDialog) {
    closeGallery.addEventListener("click", () => {
      if (typeof galleryDialog.close === "function") {
        galleryDialog.close();
      } else {
        galleryDialog.removeAttribute("open");
      }
    });

    galleryDialog.addEventListener("click", event => {
      if (event.target === galleryDialog) {
        if (typeof galleryDialog.close === "function") {
          galleryDialog.close();
        } else {
          galleryDialog.removeAttribute("open");
        }
      }
    });
  }

  // Admission form -> WhatsApp
  const admissionForm = $("#admissionForm");

  if (admissionForm) {
    admissionForm.addEventListener("submit", event => {
      event.preventDefault();

      const words = translations[currentLanguage];

      if (!admissionForm.checkValidity()) {
        admissionForm.reportValidity();
        if (formStatus) formStatus.textContent = words.formError;
        return;
      }

      const parentName = $("#parentName")?.value.trim() || "";
      const childName = $("#childName")?.value.trim() || "";
      const classValue = requestedClass?.value || "";
      const phone = $("#parentPhone")?.value.trim() || "";
      const message = $("#enquiryMessage")?.value.trim() || "";

      if (!parentName || !childName || !classValue || !phone) {
        if (formStatus) formStatus.textContent = words.formError;
        return;
      }

      const className = words.classNames[classValue] || classValue;

      const messageText = currentLanguage === "hi"
        ? `नमस्ते, मुझे Anmol New Venus Public School में प्रवेश की जानकारी चाहिए।
अभिभावक का नाम: ${parentName}
बच्चे का नाम: ${childName}
कक्षा: ${className}
मोबाइल नंबर: ${phone}
संदेश: ${message || "कोई अतिरिक्त संदेश नहीं"}`
        : `Hello, I would like admission information for Anmol New Venus Public School.
Parent's name: ${parentName}
Child's name: ${childName}
Class: ${className}
Phone: ${phone}
Message: ${message || "No additional message"}`;

      if (formStatus) formStatus.textContent = words.formSuccess;

      const whatsappURL =
        "https://wa.me/919756201099?text=" +
        encodeURIComponent(messageText);

      const newWindow = window.open(
        whatsappURL,
        "_blank",
        "noopener,noreferrer"
      );

      // Fallback in case the browser blocks pop-ups.
      if (!newWindow) {
        window.location.href = whatsappURL;
      }
    });
  }
});
