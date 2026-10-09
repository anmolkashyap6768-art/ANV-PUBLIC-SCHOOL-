
/* =====================================================
   ANV PUBLIC SCHOOL — COMPLETE SCHOOL MANAGEMENT SYSTEM
   Offline version | HTML + CSS + JavaScript
   ===================================================== */

(() => {
  "use strict";

  const DB_KEY = "ANV_PUBLIC_SCHOOL_COMPLETE_V5";

  const DEFAULT_CLASSES = [
    "Nursery", "LKG", "UKG",
    "Class 1", "Class 2", "Class 3", "Class 4",
    "Class 5", "Class 6", "Class 7", "Class 8",
    "Class 9", "Class 10", "Class 11", "Class 12"
  ];

  const DEFAULT_SUBJECTS = [
    "Hindi 1st", "English", "Mathematics", "Science",
    "Social Science", "Computer", "Sanskrit", "General Knowledge"
  ];

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];

  const esc = value => String(value ?? "").replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );

  const uid = prefix =>
    prefix + "-" + Date.now().toString(36) +
    Math.random().toString(36).slice(2, 7);

  const today = () => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0")
    ].join("-");
  };

  const money = value =>
    "₹" + Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2
    });

  const text = value => String(value ?? "").trim();

  function makeInitialDB() {
    const subjects = {};
    DEFAULT_CLASSES.forEach(className => {
      subjects[className] = [...DEFAULT_SUBJECTS];
    });

    return {
      school: {
        name: "ANV Public School",
        address: "",
        phone: "",
        session: "2026-27"
      },
      classes: [...DEFAULT_CLASSES],
      subjects,
      students: [],
      fees: [],
      results: [],
      attendance: [],
      staff: []
    };
  }

  function loadDB() {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (!raw) return makeInitialDB();

      const data = JSON.parse(raw);
      const initial = makeInitialDB();

      return {
        ...initial,
        ...data,
        school: { ...initial.school, ...(data.school || {}) },
        classes: Array.isArray(data.classes) && data.classes.length
          ? data.classes : [...DEFAULT_CLASSES],
        subjects: { ...initial.subjects, ...(data.subjects || {}) },
        students: Array.isArray(data.students) ? data.students : [],
        fees: Array.isArray(data.fees) ? data.fees : [],
        results: Array.isArray(data.results) ? data.results : [],
        attendance: Array.isArray(data.attendance) ? data.attendance : [],
        staff: Array.isArray(data.staff) ? data.staff : []
      };
    } catch (error) {
      console.error("Database load error:", error);
      return makeInitialDB();
    }
  }

  let db = loadDB();
  let page = "dashboard";
  let previousPages = [];
  let editingStudentId = "";
  let editingStaffId = "";
  let editingResultId = "";
  let selectedResultClass = db.classes[0] || "Class 1";
  let studentSearch = "";
  let studentClassFilter = "";
  let feeStudentFilter = "";
  let resultClassFilter = "";
  let attendanceClass = db.classes[0] || "Class 1";
  let attendanceDate = today();

  function saveDB() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      return true;
    } catch (error) {
      alert("डेटा सेव नहीं हुआ। फोन में स्टोरेज खाली करें और दोबारा कोशिश करें।");
      console.error(error);
      return false;
    }
  }

  function subjectsFor(className) {
    if (!Array.isArray(db.subjects[className])) {
      db.subjects[className] = [...DEFAULT_SUBJECTS];
    }
    return db.subjects[className];
  }

  function ensureSubjects() {
    db.classes.forEach(className => subjectsFor(className));
  }

  ensureSubjects();
  saveDB();

  function notify(message) {
    alert(message);
  }

  function field(label, name, value = "", type = "text", required = false) {
    return `
      <label class="field">
        <span>${esc(label)}</span>
        <input
          name="${esc(name)}"
          type="${esc(type)}"
          value="${esc(value)}"
          ${required ? "required" : ""}
        >
      </label>`;
  }

  function selectField(label, name, options, selected = "", required = false) {
    const list = options.map(option => {
      const value = typeof option === "string" ? option : option.value;
      const labelText = typeof option === "string" ? option : option.label;
      return `<option value="${esc(value)}"
        ${String(value) === String(selected) ? "selected" : ""}>
        ${esc(labelText)}
      </option>`;
    }).join("");

    return `
      <label class="field">
        <span>${esc(label)}</span>
        <select name="${esc(name)}" ${required ? "required" : ""}>
          ${list}
        </select>
      </label>`;
  }

  function button(label, action, id = "", extra = "") {
    return `<button type="button" class="btn ${extra}"
      data-action="${esc(action)}"
      ${id !== "" ? `data-id="${esc(id)}"` : ""}>
      ${esc(label)}
    </button>`;
  }

  function panel(title, body, actions = "") {
    return `
      <section class="panel">
        <div class="panel-heading">
          <h2>${esc(title)}</h2>
          ${actions}
        </div>
        ${body}
      </section>`;
  }

  function table(headers, rows) {
    if (!rows.length) {
      return `<p class="empty-state">अभी कोई रिकॉर्ड उपलब्ध नहीं है।</p>`;
    }

    return `
      <div class="table-wrap">
        <table>
          <thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell ?? ""}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function statCard(title, value, note = "") {
    return `
      <div class="stat-card">
        <div>${esc(title)}</div>
        <h2>${esc(value)}</h2>
        <small>${esc(note)}</small>
      </div>`;
  }

  function pageHeader(title, description = "") {
    return `
      <div class="page-heading">
        <div>
          <h1>${esc(title)}</h1>
          <p>${esc(description)}</p>
        </div>
        ${button("← वापस", "back", "", "secondary")}
      </div>`;
  }

  function renderNavigation() {
    const items = [
      ["dashboard", "Dashboard"],
      ["students", "Students"],
      ["subjects", "Subjects"],
      ["fees", "Fees"],
      ["results", "Results"],
      ["attendance", "Attendance"],
      ["staff", "Teachers / Staff"],
      ["classes", "Classes"],
      ["reports", "Reports / Backup"],
      ["settings", "School Settings"]
    ];

    const html = items.map(([id, label]) => `
      <button type="button"
        class="nav-btn ${page === id ? "active" : ""}"
        data-page="${id}">${esc(label)}</button>
    `).join("");

    const side = $("#sideNav");
    const mobile = $("#mobileNav");

    if (side) side.innerHTML = html;
    if (mobile) mobile.innerHTML = html;
  }

  function go(nextPage, keepHistory = true) {
    if (keepHistory && page !== nextPage) previousPages.push(page);
    page = nextPage;
    render();
  }

  function back() {
    page = previousPages.pop() || "dashboard";
    render();
  }

  function dashboardPage() {
    const totalFees = db.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);

    return `
      ${pageHeader("Dashboard", "ANV Public School — School Management")}
      <div class="cards">
        ${statCard("Total Students", db.students.length)}
        ${statCard("Classes", db.classes.length)}
        ${statCard("Teachers / Staff", db.staff.length)}
        ${statCard("Fees Collected", money(totalFees))}
      </div>
      ${panel("Quick Actions", `
        <div class="cards">
          ${button("＋ Add Student", "add-student")}
          ${button("＋ Manage Subjects", "open-subjects")}
          ${button("＋ Collect Fees", "add-fee")}
          ${button("＋ Enter Result", "add-result")}
          ${button("＋ Mark Attendance", "open-attendance")}
          ${button("＋ Add Staff", "add-staff")}
        </div>
      `)}
      ${panel("Important", `
        <p>अपने डेटा का बैकअप नियमित रूप से Reports / Backup सेक्शन से डाउनलोड करें।</p>
        <p>यह संस्करण इसी ब्राउज़र में ऑफलाइन रिकॉर्ड सेव करता है।</p>
      `)}
    `;
  }

  function studentsPage() {
    const classes = ["All Classes", ...db.classes];

    let students = [...db.students];

    if (studentClassFilter) {
      students = students.filter(s => s.className === studentClassFilter);
    }

    if (studentSearch) {
      const q = studentSearch.toLowerCase();
      students = students.filter(s =>
        [s.name, s.admissionNo, s.father, s.phone, s.className]
          .some(value => String(value || "").toLowerCase().includes(q))
      );
    }

    const rows = students.map(s => [
      esc(s.admissionNo),
      esc(s.name),
      esc(s.className),
      esc(s.father),
      esc(s.phone),
      button("Profile", "student-profile", s.id, "secondary"),
      button("Edit", "edit-student", s.id, "secondary"),
      button("Delete", "delete-student", s.id, "secondary")
    ].slice(0, 5).concat([
      button("Profile", "student-profile", s.id, "secondary"),
      button("Edit", "edit-student", s.id, "secondary"),
      button("Delete", "delete-student", s.id, "secondary")
    ]));

    return `
      ${pageHeader("Students", "विद्यार्थियों के रिकॉर्ड जोड़ें और प्रिंट करें")}
      ${panel("Search Students", `
        <div class="form-grid">
          ${field("नाम / Admission No. / Phone", "studentSearch", studentSearch)}
          ${selectField("Class Filter", "studentClassFilter",
            classes.map(c => c === "All Classes" ? { value: "", label: c } : c),
            studentClassFilter)}
        </div>
        ${button("＋ Add Student", "add-student")}
      `)}
      ${panel("Student Records", table(
        ["Admission No.", "Student Name", "Class", "Father's Name", "Phone", "Actions"],
        students.map(s => [
          esc(s.admissionNo),
          esc(s.name),
          esc(s.className),
          esc(s.father),
          esc(s.phone),
          `<div class="button-group">
            ${button("Profile / Print", "student-profile", s.id, "secondary")}
            ${button("Edit", "edit-student", s.id, "secondary")}
            ${button("Delete", "delete-student", s.id, "secondary")}
          </div>`
        ])
      ))}
    `;
  }

  function studentForm() {
    const student = db.students.find(s => s.id === editingStudentId) || {};
    const isEdit = Boolean(editingStudentId);

    return `
      ${pageHeader(isEdit ? "Edit Student" : "Add Student", "सभी आवश्यक जानकारी भरें")}
      ${panel("Student Admission Form", `
        <form id="studentForm">
          <div class="form-grid">
            ${field("Student Name", "name", student.name, "text", true)}
            ${field("Admission Number", "admissionNo", student.admissionNo || "", "text", true)}
            ${selectField("Class", "className", db.classes, student.className || db.classes[0], true)}
            ${field("Date of Birth", "dob", student.dob, "date")}
            ${selectField("Gender", "gender", ["Male", "Female", "Other"], student.gender || "Male")}
            ${field("Father's Name", "father", student.father)}
            ${field("Mother's Name", "mother", student.mother)}
            ${field("Parent / Guardian Phone", "phone", student.phone, "tel")}
            ${field("Address", "address", student.address)}
            ${field("Previous School", "previousSchool", student.previousSchool)}
            ${field("Admission Date", "admissionDate", student.admissionDate || today(), "date")}
            ${field("Annual Fee (₹)", "annualFee", student.annualFee || "0", "number")}
            ${field("Emergency Contact", "emergencyContact", student.emergencyContact, "tel")}
            ${field("Blood Group", "bloodGroup", student.bloodGroup)}
          </div>
          <div class="button-group">
            <button class="btn" type="submit">${isEdit ? "Update Student" : "Save Student"}</button>
            <button class="btn secondary" type="button" data-action="back">Cancel</button>
          </div>
        </form>
      `)}
    `;
  }

  function studentProfile(id) {
    const s = db.students.find(item => item.id === id);
    if (!s) return studentsPage();

    const fields = [
      ["Admission No.", s.admissionNo],
      ["Name", s.name],
      ["Class", s.className],
      ["Date of Birth", s.dob],
      ["Gender", s.gender],
      ["Father's Name", s.father],
      ["Mother's Name", s.mother],
      ["Phone", s.phone],
      ["Address", s.address],
      ["Previous School", s.previousSchool],
      ["Admission Date", s.admissionDate],
      ["Annual Fee", money(s.annualFee)],
      ["Emergency Contact", s.emergencyContact],
      ["Blood Group", s.bloodGroup]
    ];

    return `
      ${pageHeader("Student Profile", "विद्यार्थी की पूरी जानकारी")}
      ${panel("Biodata", `
        <div id="profilePrint">
          <h2>${esc(db.school.name)}</h2>
          <h3>Student Biodata</h3>
          ${table(["Field", "Details"], fields.map(([k, v]) => [esc(k), esc(v || "—")]))}
        </div>
        ${button("Print Biodata", "print-student", s.id)}
        ${button("Edit Student", "edit-student", s.id, "secondary")}
      `)}
    `;
  }

  /* -------- SUBJECT MANAGEMENT: ADD / DELETE -------- */

  function subjectsPage() {
    const className = selectedResultClass || db.classes[0];
    const subjects = subjectsFor(className);

    return `
      ${pageHeader("Subject Management", "हर क्लास के विषय अलग-अलग जोड़ें या हटाएँ")}
      ${panel("Choose Class", `
        <form id="subjectClassForm">
          <div class="form-grid">
            ${selectField("Select Class", "subjectClass", db.classes, className, true)}
          </div>
          <button class="btn" type="submit">Show Subjects</button>
        </form>
      `)}
      ${panel("Add New Subject", `
        <form id="addSubjectForm">
          <div class="form-grid">
            ${field("Subject Name", "subjectName", "", "text", true)}
          </div>
          <button class="btn" type="submit">＋ Add Subject</button>
        </form>
      `)}
      ${panel(className + " — Subject List", `
        <p>Total Subjects: <strong>${subjects.length}</strong></p>
        ${table(["No.", "Subject Name", "Action"],
          subjects.map((subject, index) => [
            String(index + 1),
            esc(subject),
            button("Delete Subject", "delete-subject", String(index), "secondary")
          ])
        )}
        <p><small>ध्यान दें: विषय हटाने पर वह आगे नए Results में नहीं आएगा। पहले से सेव मार्कशीट का डेटा अलग रिकॉर्ड में रहता है।</small></p>
      `)}
    `;
  }

  /* -------- FEES -------- */

  function feesPage() {
    const students = db.students.filter(s =>
      !feeStudentFilter || s.id === feeStudentFilter
    );

    const collected = db.fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    return `
      ${pageHeader("Fees Management", "Quarterly fees और payment receipts")}
      <div class="cards">
        ${statCard("Total Payments", db.fees.length)}
        ${statCard("Total Collected", money(collected))}
      </div>
      ${panel("Collect Quarterly Fee", `
        <form id="feeForm">
          <div class="form-grid">
            ${selectField("Student", "studentId",
              db.students.map(s => ({ value: s.id, label: `${s.name} — ${s.className} (${s.admissionNo})` })),
              "", true)}
            ${selectField("Quarter", "quarter", ["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"], "Quarter 1", true)}
            ${field("Total Annual Fee (₹)", "totalFee", "", "number", true)}
            ${field("Amount Paid (₹)", "amount", "", "number", true)}
            ${field("Payment Date", "paymentDate", today(), "date", true)}
            ${selectField("Payment Mode", "paymentMode", ["Cash", "UPI", "Bank Transfer", "Cheque", "Other"], "Cash")}
            ${field("Receipt Note", "note", "")}
          </div>
          <button class="btn" type="submit">Save Payment & Receipt</button>
        </form>
      `)}
      ${panel("Fee Records", table(
        ["Receipt", "Date", "Student", "Class", "Quarter", "Paid", "Mode", "Actions"],
        db.fees.map(f => {
          const s = db.students.find(st => st.id === f.studentId) || {};
          return [
            esc(f.receiptNo),
            esc(f.paymentDate),
            esc(s.name || "Deleted Student"),
            esc(s.className || "—"),
            esc(f.quarter),
            money(f.amount),
            esc(f.paymentMode),
            button("Print Receipt", "print-receipt", f.id, "secondary")
          ];
        })
      ))}
    `;
  }

  /* -------- RESULTS -------- */

  function resultsPage() {
    const list = db.results.filter(r =>
      !resultClassFilter || r.className === resultClassFilter
    );

    return `
      ${pageHeader("Results & Marksheets", "विषयवार अंक, कुल अंक और प्रतिशत")}
      ${panel("Class Filter", `
        <form id="resultFilterForm">
          <div class="form-grid">
            ${selectField("Class", "resultClassFilter",
              [{ value: "", label: "All Classes" }, ...db.classes],
              resultClassFilter)}
          </div>
          <button class="btn" type="submit">Show Results</button>
        </form>
        ${button("＋ Enter New Result", "add-result")}
        ${button("Manage Subjects", "open-subjects", "", "secondary")}
      `)}
      ${panel("Saved Results", table(
        ["Student", "Class", "Exam", "Total", "Percentage", "Actions"],
        list.map(r => {
          const s = db.students.find(st => st.id === r.studentId) || {};
          const total = r.subjects.reduce((sum, sub) => sum + Number(sub.marks || 0), 0);
          const max = r.subjects.reduce((sum, sub) => sum + Number(sub.maxMarks || 100), 0);
          const pct = max ? (total / max * 100).toFixed(2) : "0.00";

          return [
            esc(s.name || r.studentName || "Unknown"),
            esc(r.className),
            esc(r.exam),
            `${total} / ${max}`,
            pct + "%",
            `<div class="button-group">
              ${button("Print Marksheet", "print-result", r.id, "secondary")}
              ${button("Delete", "delete-result", r.id, "secondary")}
            </div>`
          ];
        })
      ))}
    `;
  }

  function resultForm() {
    const existing = db.results.find(r => r.id === editingResultId);
    const className = existing?.className || selectedResultClass || db.classes[0];
    const subjects = subjectsFor(className);
    const students = db.students.filter(s => s.className === className);

    const savedMarks = {};
    if (existing) {
      existing.subjects.forEach(sub => {
        savedMarks[sub.name] = sub;
      });
    }

    return `
      ${pageHeader("Enter Result", "पहले क्लास चुनें, फिर विद्यार्थी और विषयों के अंक भरें")}
      ${panel("Result Form", `
        <form id="resultForm">
          <div class="form-grid">
            ${selectField("Class", "className", db.classes, className, true)}
            ${selectField("Student", "studentId",
              students.map(s => ({ value: s.id, label: `${s.name} (${s.admissionNo})` })),
              existing?.studentId || "", true)}
            ${field("Exam Name", "exam", existing?.exam || "Annual Examination", "text", true)}
            ${field("Exam Date", "examDate", existing?.examDate || today(), "date")}
          </div>
          <h3>Subject Marks</h3>
          <div id="subjectMarksContainer">
            ${subjects.map((sub, index) => {
              const old = savedMarks[sub] || {};
              return `
                <div class="form-grid marks-row">
                  <label class="field">
                    <span>${esc(sub)}</span>
                    <input name="marks_${index}" type="number" min="0"
                      max="${Number(old.maxMarks || 100)}"
                      value="${esc(old.marks ?? "")}" required>
                  </label>
                  <label class="field">
                    <span>Maximum Marks</span>
                    <input name="max_${index}" type="number" min="1"
                      value="${esc(old.maxMarks || 100)}" required>
                  </label>
                </div>`;
            }).join("")}
          </div>
          <input type="hidden" name="subjectCount" value="${subjects.length}">
          <button class="btn" type="submit">Save Result</button>
          <button class="btn secondary" type="button" data-action="back">Cancel</button>
        </form>
      `)}
      ${students.length ? "" : "<p>इस क्लास में कोई विद्यार्थी नहीं है। पहले Student जोड़ें।</p>"}
    `;
  }

  /* -------- ATTENDANCE -------- */

  function attendancePage() {
    const list = db.students.filter(s => s.className === attendanceClass);
    const records = db.attendance.filter(a =>
      a.date === attendanceDate && a.className === attendanceClass
    );

    const saved = {};
    records.forEach(r => saved[r.studentId] = r.status);

    return `
      ${pageHeader("Attendance", "क्लास और तारीख के हिसाब से उपस्थिति")}
      ${panel("Choose Class & Date", `
        <form id="attendanceFilterForm">
          <div class="form-grid">
            ${selectField("Class", "attendanceClass", db.classes, attendanceClass, true)}
            ${field("Date", "attendanceDate", attendanceDate, "date", true)}
          </div>
          <button class="btn" type="submit">Load Students</button>
        </form>
      `)}
      ${panel("Mark Attendance", `
        <form id="attendanceForm">
          <input type="hidden" name="className" value="${esc(attendanceClass)}">
          <input type="hidden" name="date" value="${esc(attendanceDate)}">
          ${table(["Admission No.", "Student", "Status"], list.map(s => [
            esc(s.admissionNo),
            esc(s.name),
            `<select name="status_${esc(s.id)}">
              ${["Present", "Absent", "Late", "Leave"].map(status =>
                `<option ${((saved[s.id] || "Present") === status) ? "selected" : ""}
                  value="${status}">${status}</option>`
              ).join("")}
            </select>`
          ]))}
          <button class="btn" type="submit">Save Attendance</button>
        </form>
      `)}
    `;
  }

  /* -------- STAFF -------- */

  function staffPage() {
    return `
      ${pageHeader("Teachers & Staff", "Staff के रिकॉर्ड")}
      ${panel("Add Staff Member", `
        <form id="staffForm">
          <div class="form-grid">
            ${field("Full Name", "name", "", "text", true)}
            ${field("Designation", "designation", "", "text", true)}
            ${field("Phone", "phone", "", "tel")}
            ${field("Salary (₹)", "salary", "", "number")}
            ${field("Joining Date", "joiningDate", today(), "date")}
          </div>
          <button class="btn" type="submit">Save Staff</button>
        </form>
      `)}
      ${panel("Staff Records", table(
        ["Name", "Designation", "Phone", "Salary", "Joining Date", "Action"],
        db.staff.map(s => [
          esc(s.name), esc(s.designation), esc(s.phone),
          money(s.salary), esc(s.joiningDate),
          `<div class="button-group">
            ${button("Edit", "edit-staff", s.id, "secondary")}
            ${button("Delete", "delete-staff", s.id, "secondary")}
          </div>`
        ])
      ))}
    `;
  }

  function editStaffPage() {
    const s = db.staff.find(item => item.id === editingStaffId);
    if (!s) return staffPage();

    return `
      ${pageHeader("Edit Staff", "Staff जानकारी अपडेट करें")}
      ${panel("Edit Staff Details", `
        <form id="editStaffForm">
          ${field("Full Name", "name", s.name, "text", true)}
          ${field("Designation", "designation", s.designation, "text", true)}
          ${field("Phone", "phone", s.phone, "tel")}
          ${field("Salary (₹)", "salary", s.salary, "number")}
          ${field("Joining Date", "joiningDate", s.joiningDate, "date")}
          <button class="btn" type="submit">Update Staff</button>
        </form>
      `)}
    `;
  }

  /* -------- CLASSES -------- */

  function classesPage() {
    return `
      ${pageHeader("Classes", "क्लास जोड़ें या हटाएँ")}
      ${panel("Add Class", `
        <form id="addClassForm">
          ${field("Class Name", "className", "", "text", true)}
          <button class="btn" type="submit">＋ Add Class</button>
        </form>
      `)}
      ${panel("Class List", table(
        ["Class Name", "Students", "Subjects", "Action"],
        db.classes.map(className => [
          esc(className),
          db.students.filter(s => s.className === className).length,
          subjectsFor(className).length,
          button("Delete Class", "delete-class", className, "secondary")
        ])
      ))}
    `;
  }

  /* -------- REPORTS / BACKUP -------- */

  function reportsPage() {
    const totalCollected = db.fees.reduce((sum, f) => sum + Number(f.amount || 0), 0);

    return `
      ${pageHeader("Reports & Backup", "रिकॉर्ड देखें और डेटा का बैकअप रखें")}
      ${panel("School Summary", `
        <div class="cards">
          ${statCard("Students", db.students.length)}
          ${statCard("Staff", db.staff.length)}
          ${statCard("Fee Records", db.fees.length)}
          ${statCard("Fees Collected", money(totalCollected))}
        </div>
      `)}
      ${panel("Backup & Restore", `
        <p>Backup डाउनलोड करके सुरक्षित रखें। इससे फोन बदलने पर डेटा वापस लाने में मदद मिलेगी।</p>
        <div class="button-group">
          ${button("Download Backup JSON", "export-backup")}
          <label class="btn secondary">
            Restore Backup
            <input type="file" id="importBackup" accept=".json,application/json"
              style="display:none">
          </label>
        </div>
        <hr>
        <p>Students CSV डाउनलोड करें:</p>
        ${button("Export Students CSV", "export-students")}
        <p>Fees CSV डाउनलोड करें:</p>
        ${button("Export Fees CSV", "export-fees")}
      `)}
    `;
  }

  /* -------- SCHOOL SETTINGS -------- */

  function settingsPage() {
    return `
      ${pageHeader("School Settings", "स्कूल का नाम और जानकारी")}
      ${panel("School Details", `
        <form id="settingsForm">
          ${field("School Name", "name", db.school.name, "text", true)}
          ${field("Address", "address", db.school.address)}
          ${field("Phone", "phone", db.school.phone, "tel")}
          ${field("Academic Session", "session", db.school.session)}
          <button class="btn" type="submit">Save Settings</button>
        </form>
      `)}
    `;
  }

  function render() {
    renderNavigation();

    const app = $("#app");
    if (!app) {
      console.error('HTML में id="app" नहीं मिला।');
      return;
    }

    const pages = {
      dashboard: dashboardPage,
      students: studentsPage,
      studentForm: studentForm,
      subjects: subjectsPage,
      fees: feesPage,
      results: resultsPage,
      resultForm: resultForm,
      attendance: attendancePage,
      staff: staffPage,
      staffEdit: editStaffPage,
      classes: classesPage,
      reports: reportsPage,
      settings: settingsPage
    };

    try {
      app.innerHTML = (pages[page] || dashboardPage)();
    } catch (error) {
      console.error("Page render error:", error);
      app.innerHTML = `
        <section class="panel">
          <h2>कुछ गड़बड़ हुई</h2>
          <p>${esc(error.message)}</p>
          <button class="btn" data-action="back">वापस</button>
        </section>`;
    }
  }

  /* -------- PRINTING -------- */

  function printDocument(title, content) {
    const win = window.open("", "_blank");

    if (!win) {
      notify("Print window नहीं खुली। Browser में pop-ups की अनुमति दें।");
      return;
    }

    win.document.open();
    win.document.write(`<!DOCTYPE html>
      <html lang="hi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${esc(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #111; }
          h1,h2,h3,p { text-align: center; }
          table { width: 100%; border-collapse: collapse; margin: 16px 0; }
          th,td { border: 1px solid #555; padding: 8px; text-align: left; }
          th { background: #eee; }
          .signature { display: flex; justify-content: space-between; margin-top: 60px; }
          button { padding: 10px 20px; margin: 12px 0; }
          @media print { .no-print { display: none; } body { padding: 0; } }
        </style>
      </head>
      <body>
        <div class="no-print"><button onclick="window.print()">Print / Save PDF</button></div>
        ${content}
      </body>
      </html>`);
    win.document.close();
  }

  function printStudent(id) {
    const s = db.students.find(st => st.id === id);
    if (!s) return;

    const items = [
      ["Admission No.", s.admissionNo], ["Student Name", s.name],
      ["Class", s.className], ["Date of Birth", s.dob],
      ["Gender", s.gender], ["Father's Name", s.father],
      ["Mother's Name", s.mother], ["Phone", s.phone],
      ["Address", s.address], ["Admission Date", s.admissionDate],
      ["Previous School", s.previousSchool], ["Blood Group", s.bloodGroup],
      ["Emergency Contact", s.emergencyContact]
    ];

    printDocument("Student Biodata", `
      <h1>${esc(db.school.name)}</h1>
      <p>${esc(db.school.address)}</p>
      <h2>Student Biodata</h2>
      ${table(["Information", "Details"], items.map(([k, v]) => [esc(k), esc(v || "—")]))}
      <div class="signature"><span>Parent Signature</span><span>Principal Signature</span></div>
    `);
  }

  function printReceipt(id) {
    const f = db.fees.find(item => item.id === id);
    if (!f) return;

    const s = db.students.find(st => st.id === f.studentId) || {};

    printDocument("Fee Receipt", `
      <h1>${esc(db.school.name)}</h1>
      <p>${esc(db.school.address)}</p>
      <h2>Fee Payment Receipt</h2>
      ${table(["Detail", "Information"], [
        ["Receipt Number", esc(f.receiptNo)],
        ["Payment Date", esc(f.paymentDate)],
        ["Student", esc(s.name || "Deleted Student")],
        ["Admission Number", esc(s.admissionNo || "—")],
        ["Class", esc(s.className || "—")],
        ["Quarter", esc(f.quarter)],
        ["Total Annual Fee", money(f.totalFee)],
        ["Amount Paid", money(f.amount)],
        ["Payment Mode", esc(f.paymentMode)],
        ["Note", esc(f.note || "—")]
      ])}
      <div class="signature"><span>Cashier</span><span>Principal</span></div>
    `);
  }

  function printResult(id) {
    const r = db.results.find(item => item.id === id);
    if (!r) return;

    const s = db.students.find(st => st.id === r.studentId) || {};
    const total = r.subjects.reduce((sum, sub) => sum + Number(sub.marks || 0), 0);
    const max = r.subjects.reduce((sum, sub) => sum + Number(sub.maxMarks || 100), 0);
    const pct = max ? total / max * 100 : 0;
    const passed = r.subjects.every(sub =>
      Number(sub.marks) >= Number(sub.maxMarks) * 0.33
    );

    printDocument("Student Marksheet", `
      <h1>${esc(db.school.name)}</h1>
      <p>${esc(db.school.address)}</p>
      <h2>MARKSHEET</h2>
      ${table(["Student Detail", "Information"], [
        ["Student Name", esc(s.name || r.studentName || "—")],
        ["Admission Number", esc(s.admissionNo || "—")],
        ["Class", esc(r.className)],
        ["Examination", esc(r.exam)],
        ["Exam Date", esc(r.examDate || "—")]
      ])}
      ${table(["Subject", "Maximum Marks", "Marks Obtained", "Result"],
        r.subjects.map(sub => [
          esc(sub.name),
          esc(sub.maxMarks),
          esc(sub.marks),
          Number(sub.marks) >= Number(sub.maxMarks) * 0.33 ? "Pass" : "Needs Improvement"
        ])
      )}
      <h3>Total: ${total} / ${max}</h3>
      <h3>Percentage: ${pct.toFixed(2)}%</h3>
      <h3>Overall Status: ${passed ? "PASS" : "NEEDS IMPROVEMENT"}</h3>
      <div class="signature"><span>Class Teacher</span><span>Principal</span></div>
    `);
  }

  /* -------- CSV / BACKUP -------- */

  function downloadFile(filename, content, type = "text/plain;charset=utf-8") {
    const blob = new Blob(["\uFEFF", content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function toCSV(rows) {
    return rows.map(row => row.map(value =>
      '"' + String(value ?? "").replace(/"/g, '""') + '"'
    ).join(",")).join("\r\n");
  }

  /* -------- NAVIGATION CLICKS -------- */

  document.addEventListener("click", event => {
    const nav = event.target.closest("[data-page]");
    if (nav) {
      const target = nav.getAttribute("data-page");
      if (target) go(target);
      return;
    }

    const btn = event.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id") || "";

    switch (action) {
      case "back":
        back();
        break;

      case "add-student":
        editingStudentId = "";
        go("studentForm");
        break;

      case "edit-student":
        editingStudentId = id;
        go("studentForm");
        break;

      case "student-profile":
        page = "studentProfile";
        const app = $("#app");
        if (app) app.innerHTML = studentProfile(id);
        renderNavigation();
        break;

      case "delete-student": {
        const s = db.students.find(st => st.id === id);
        if (!s) break;
        if (confirm(`क्या ${s.name} को डिलीट करना है?`)) {
          db.students = db.students.filter(st => st.id !== id);
          saveDB();
          render();
        }
        break;
      }

      case "print-student":
        printStudent(id);
        break;

      case "open-subjects":
        selectedResultClass = selectedResultClass || db.classes[0];
        go("subjects");
        break;

      case "delete-subject": {
        const className = selectedResultClass || db.classes[0];
        const index = Number(id);
        const list = subjectsFor(className);
        if (!Number.isInteger(index) || index < 0 || index >= list.length) break;

        if (confirm(`"${list[index]}" विषय को ${className} से हटाना है?`)) {
          list.splice(index, 1);
          saveDB();
          render();
        }
        break;
      }

      case "add-fee":
        go("fees");
        break;

      case "print-receipt":
        printReceipt(id);
        break;

      case "add-result":
        editingResultId = "";
        selectedResultClass = db.classes[0] || "Class 1";
        go("resultForm");
        break;

      case "print-result":
        printResult(id);
        break;

      case "delete-result":
        if (confirm("इस result को डिलीट करना है?")) {
          db.results = db.results.filter(r => r.id !== id);
          saveDB();
          render();
        }
        break;

      case "open-attendance":
        go("attendance");
        break;

      case "add-staff":
        editingStaffId = "";
        go("staff");
        break;

      case "edit-staff":
        editingStaffId = id;
        go("staffEdit");
        break;

      case "delete-staff":
        if (confirm("इस staff record को डिलीट करना है?")) {
          db.staff = db.staff.filter(s => s.id !== id);
          saveDB();
          render();
        }
        break;

      case "delete-class":
        if (confirm(`"${id}" क्लास को हटाना है?`)) {
          if (db.students.some(s => s.className === id)) {
            notify("पहले इस क्लास के विद्यार्थियों को दूसरी क्लास में स्थानांतरित करें या हटाएँ।");
            break;
          }
          db.classes = db.classes.filter(c => c !== id);
          delete db.subjects[id];
          saveDB();
          render();
        }
        break;

      case "export-backup":
        downloadFile("ANV_School_Backup.json", JSON.stringify(db, null, 2),
          "application/json");
        break;

      case "export-students":
        downloadFile("ANV_Students.csv", toCSV([
          ["Admission No", "Name", "Class", "Father", "Mother", "Phone", "Address"],
          ...db.students.map(s => [
            s.admissionNo, s.name, s.className, s.father,
            s.mother, s.phone, s.address
          ])
        ]), "text/csv;charset=utf-8");
        break;

      case "export-fees":
        downloadFile("ANV_Fees.csv", toCSV([
          ["Receipt", "Date", "Student ID", "Quarter", "Amount", "Mode"],
          ...db.fees.map(f => [
            f.receiptNo, f.paymentDate, f.studentId,
            f.quarter, f.amount, f.paymentMode
          ])
        ]), "text/csv;charset=utf-8");
        break;
    }
  });

  /* -------- FORM SUBMISSION -------- */

  document.addEventListener("submit", event => {
    const form = event.target;
    const data = new FormData(form);

    if (form.id === "studentForm") {
      event.preventDefault();

      const admissionNo = text(data.get("admissionNo"));
      const duplicate = db.students.find(s =>
        s.admissionNo.toLowerCase() === admissionNo.toLowerCase() &&
        s.id !== editingStudentId
      );

      if (duplicate) {
        notify("यह Admission Number पहले से मौजूद है।");
        return;
      }

      const student = {
        id: editingStudentId || uid("STU"),
        name: text(data.get("name")),
        admissionNo,
        className: text(data.get("className")),
        dob: text(data.get("dob")),
        gender: text(data.get("gender")),
        father: text(data.get("father")),
        mother: text(data.get("mother")),
        phone: text(data.get("phone")),
        address: text(data.get("address")),
        previousSchool: text(data.get("previousSchool")),
        admissionDate: text(data.get("admissionDate")),
        annualFee: Number(data.get("annualFee") || 0),
        emergencyContact: text(data.get("emergencyContact")),
        bloodGroup: text(data.get("bloodGroup"))
      };

      if (editingStudentId) {
        const index = db.students.findIndex(s => s.id === editingStudentId);
        if (index >= 0) db.students[index] = student;
      } else {
        db.students.push(student);
      }

      saveDB();
      editingStudentId = "";
      studentSearch = "";
      notify("Student record सेव हो गया।");
      go("students");
      return;
    }

    if (form.id === "subjectClassForm") {
      event.preventDefault();
      selectedResultClass = text(data.get("subjectClass"));
      render();
      return;
    }

    if (form.id === "addSubjectForm") {
      event.preventDefault();

      const name = text(data.get("subjectName"));
      const className = selectedResultClass || db.classes[0];

      if (!name) {
        notify("विषय का नाम लिखें।");
        return;
      }

      const list = subjectsFor(className);
      if (list.some(s => s.toLowerCase() === name.toLowerCase())) {
        notify("यह विषय इस क्लास में पहले से मौजूद है।");
        return;
      }

      list.push(name);
      saveDB();
      notify(`${name} विषय ${className} में जोड़ दिया गया।`);
      render();
      return;
    }

    if (form.id === "feeForm") {
      event.preventDefault();

      const studentId = text(data.get("studentId"));
      const totalFee = Number(data.get("totalFee"));
      const amount = Number(data.get("amount"));

      if (!studentId) {
        notify("पहले Student जोड़ें।");
        return;
      }
      if (totalFee <= 0 || amount <= 0 || amount > totalFee) {
        notify("कृपया फीस की सही राशि भरें।");
        return;
      }

      const fee = {
        id: uid("FEE"),
        receiptNo: "ANV-" + Date.now().toString().slice(-8),
        studentId,
        quarter: text(data.get("quarter")),
        totalFee,
        amount,
        paymentDate: text(data.get("paymentDate")),
        paymentMode: text(data.get("paymentMode")),
        note: text(data.get("note"))
      };

      db.fees.push(fee);
      saveDB();
      notify("Fee payment सेव हो गया। अब Receipt Print कर सकते हैं।");
      render();
      return;
    }

    if (form.id === "resultFilterForm") {
      event.preventDefault();
      resultClassFilter = text(data.get("resultClassFilter"));
      render();
      return;
    }

    if (form.id === "resultForm") {
      event.preventDefault();

      const className = text(data.get("className"));
      const studentId = text(data.get("studentId"));
      const student = db.students.find(s => s.id === studentId);
      const subjects = subjectsFor(className);
      const count = Number(data.get("subjectCount"));
      const subjectMarks = [];

      if (!student) {
        notify("इस क्लास का विद्यार्थी चुनें।");
        return;
      }

      if (!subjects.length || count !== subjects.length) {
        notify("इस क्लास में कोई विषय नहीं है। पहले Subjects में विषय जोड़ें।");
        return;
      }

      for (let i = 0; i < subjects.length; i++) {
        const marks = Number(data.get("marks_" + i));
        const maxMarks = Number(data.get("max_" + i));

        if (!Number.isFinite(marks) || !Number.isFinite(maxMarks) ||
            maxMarks <= 0 || marks < 0 || marks > maxMarks) {
          notify(`${subjects[i]} के अंक सही भरें। Marks अधिकतम अंकों से ज्यादा नहीं हो सकते।`);
          return;
        }

        subjectMarks.push({
          name: subjects[i],
          marks,
          maxMarks
        });
      }

      const result = {
        id: editingResultId || uid("RES"),
        studentId,
        studentName: student.name,
        className,
        exam: text(data.get("exam")),
        examDate: text(data.get("examDate")),
        subjects: subjectMarks
      };

      if (editingResultId) {
        const index = db.results.findIndex(r => r.id === editingResultId);
        if (index >= 0) db.results[index] = result;
      } else {
        db.results.push(result);
      }

      editingResultId = "";
      saveDB();
      notify("Result सेव हो गया।");
      go("results");
      return;
    }

    if (form.id === "attendanceFilterForm") {
      event.preventDefault();
      attendanceClass = text(data.get("attendanceClass"));
      attendanceDate = text(data.get("attendanceDate")) || today();
      render();
      return;
    }

    if (form.id === "attendanceForm") {
      event.preventDefault();

      const className = text(data.get("className"));
      const date = text(data.get("date"));

      db.attendance = db.attendance.filter(a =>
        !(a.className === className && a.date === date)
      );

      db.students.filter(s => s.className === className).forEach(s => {
        db.attendance.push({
          id: uid("ATT"),
          studentId: s.id,
          className,
          date,
          status: text(data.get("status_" + s.id)) || "Present"
        });
      });

      saveDB();
      notify("Attendance सेव हो गई।");
      render();
      return;
    }

    if (form.id === "staffForm") {
      event.preventDefault();

      db.staff.push({
        id: uid("STAFF"),
        name: text(data.get("name")),
        designation: text(data.get("designation")),
        phone: text(data.get("phone")),
        salary: Number(data.get("salary") || 0),
        joiningDate: text(data.get("joiningDate"))
      });

      saveDB();
      notify("Staff record सेव हो गया।");
      render();
      return;
    }

    if (form.id === "editStaffForm") {
      event.preventDefault();
      const staff = db.staff.find(s => s.id === editingStaffId);
      if (!staff) return;

      staff.name = text(data.get("name"));
      staff.designation = text(data.get("designation"));
      staff.phone = text(data.get("phone"));
      staff.salary = Number(data.get("salary") || 0);
      staff.joiningDate = text(data.get("joiningDate"));

      saveDB();
      editingStaffId = "";
      notify("Staff record अपडेट हो गया।");
      go("staff");
      return;
    }

    if (form.id === "addClassForm") {
      event.preventDefault();
      const name = text(data.get("className"));

      if (!name) return;
      if (db.classes.some(c => c.toLowerCase() === name.toLowerCase())) {
        notify("यह क्लास पहले से मौजूद है।");
        return;
      }

      db.classes.push(name);
      db.subjects[name] = [...DEFAULT_SUBJECTS];
      selectedResultClass = name;
      saveDB();
      notify("नई क्लास जोड़ दी गई।");
      render();
      return;
    }

    if (form.id === "settingsForm") {
      event.preventDefault();

      db.school.name = text(data.get("name")) || "ANV Public School";
      db.school.address = text(data.get("address"));
      db.school.phone = text(data.get("phone"));
      db.school.session = text(data.get("session"));

      saveDB();
      notify("School settings सेव हो गईं।");
      render();
      return;
    }
  });

  /* -------- FILTER INPUTS -------- */

  document.addEventListener("change", event => {
    const target = event.target;

    if (target.id === "importBackup" && target.files?.[0]) {
      const file = target.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const imported = JSON.parse(reader.result);

          if (!imported || !Array.isArray(imported.students) ||
              !Array.isArray(imported.classes)) {
            throw new Error("यह ANV School backup file नहीं है।");
          }

          if (!confirm("Restore करने से वर्तमान डेटा बदल जाएगा। जारी रखें?")) return;

          db = {
            ...makeInitialDB(),
            ...imported,
            school: { ...makeInitialDB().school, ...(imported.school || {}) }
          };

          ensureSubjects();
          saveDB();
          notify("Backup restore हो गया।");
          go("dashboard", false);
        } catch (error) {
          notify("Backup restore नहीं हुआ: " + error.message);
        }
      };

      reader.readAsText(file);
    }

    if (target.name === "className" && page === "resultForm") {
      selectedResultClass = text(target.value);
      editingResultId = "";
      render();
    }
  });

  document.addEventListener("input", event => {
    const target = event.target;

    if (target.name === "studentSearch") {
      studentSearch = target.value;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      render();
      const input = $('input[name="studentSearch"]');
      if (input) {
        input.focus();
        input.setSelectionRange(start, end);
      }
    }
  });

  /* -------- INITIAL START -------- */

  render();

  console.log("ANV Public School system loaded successfully.");
})();
