// --- 1. GOOGLE SHEETS API & LEGACY CACHE ---
// PASTE YOUR NEW WEB APP URL HERE:
const GOOGLE_SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbwMP-OJMwrra6o_TJIpH5aSSKyiULSa4m75tEC1DZ4riM_GHmHh2jUPJ9W_vIakmiBFKQ/exec";

const legacyTeams = {
    "sukhenmandal836@gmail.com": "APPIFY US",
    "dipanlahiri207official@gmail.com": "Binary_Brain",
    "samitgupta.dev@gmail.com": "Blueprint Zero",
    "debkantaruj703@gmail.com": "BUGS",
    "abjinighosal01@gmail.com": "Byte & Bloom",
    "soumyadeepjana9564@gmail.com": "ByteHealers",
    "tirnade@gmail.com": "Code Crafters",
    "sahamontro@gmail.com": "Friends with Functions",
    "oyesheedutta24@gmail.com": "JusHackers",
    "tamosadey11@gmail.com": "Lobsters",
    "dasarchisman21@gmail.com": "Unemployable Khargosh",
    "rochishnu.dutta3127@gmail.com": "Mango Bytes",
    "jaiswalrudrans@gmail.com": "Neural Overdrive",
    "kounakmajumder@gmail.com": "Novo",
    "joyghatak0099@gmail.com": "Nyaya Nexus",
    "sghatak.cyber@gmail.com": "Pentagon",
    "aishsharma01022005@gmail.com": "Phoenix",
    "gsaha5911@gmail.com": "Royal Coders",
    "ankitamandal471@gmail.com": "Slay Queens",
    "sudhakar.knapsack@gmail.com": "SYNTAX SQUAD",
    "saikatmohis.slsn10b@gmail.com": "Team_Losers",
    "rahuldev7857@gmail.com": "Tech-Eagles",
    "sarkar.anju2004@gmail.com": "Tensor Titans",
    "irishakaran@gmail.com": "The Chandler",
    "prisharoychaudhuri@gmail.com": "Tufan",
    "sr5863183@gmail.com": "Twinkling Star",
    "chandrachurdhar93@gmail.com": "Wildstone"
};

document.addEventListener('DOMContentLoaded', () => {
    
    const sidebar = document.getElementById('sidebar');
    const openBtn = document.getElementById('openSidebar');
    const closeBtn = document.getElementById('closeSidebar');
    const body = document.getElementById('main-body');
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    const backgroundMap = {
        'home': 'bg-central-perk',
        'about': 'bg-ross',
        'register': 'bg-monica',
        'help': 'bg-phoebe',
        'faq': 'bg-joeychan'
    };

    function toggleSidebar() { sidebar.classList.toggle('open'); }
    openBtn.addEventListener('click', toggleSidebar);
    closeBtn.addEventListener('click', toggleSidebar);

    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSectionId = this.getAttribute('data-section');

            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            body.className = ''; 
            body.classList.add(backgroundMap[targetSectionId]);

            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${targetSectionId}-section`).classList.add('active');

            if (sidebar.classList.contains('open')) { toggleSidebar(); }
        });
    });

    const MAX_ADDITIONAL_MEMBERS = 5; 
    let currentMembers = 0;
    let isEditing = false; 
    let editDocumentId = null; 
    const friendsNames = ['The Rachel', 'The Monica', 'The Chandler', 'The Joey', 'The Phoebe'];

    const membersContainer = document.getElementById('membersContainer');
    const addMemberBtn = document.getElementById('addMemberBtn');
    const form = document.getElementById('hackathonForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');

    function createMemberSection(index) {
        const section = document.createElement('section');
        section.className = 'form-card member-section';
        section.id = `member-${index}`;
        const charName = friendsNames[index - 1]; 
        
        section.innerHTML = `
            <button type="button" class="remove-btn" onclick="removeMember(${index})">Remove</button>
            <h2>${charName} (Team Member ${index + 1})</h2>
            <div class="form-grid">
                <div class="form-group"><label>Name *</label><input type="text" class="member-name" required></div>
                <div class="form-group"><label>Department *</label><input type="text" class="member-dept" placeholder="e.g., CSE" required></div>
                <div class="form-group"><label>Enrollment Number *</label><input type="text" class="member-enroll" required></div>
                <div class="form-group">
                    <label>Year *</label>
                    <select class="member-year" required>
                        <option value="" disabled selected>Select year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                </div>
                <div class="form-group"><label>Discord ID *</label><input type="text" class="member-discord" placeholder="e.g., username123" required></div>
                <div class="form-group"><label>Contact Number *</label><input type="tel" class="member-contact" required></div>
                <div class="form-group"><label>WhatsApp Number *</label><input type="tel" class="member-whatsapp" required></div>
                <div class="form-group full-width">
                    <label>Campus *</label>
                    <select class="member-campus" required>
                        <option value="" disabled selected>Select campus</option>
                        <option value="IEM NEWTOWN">IEM NEWTOWN</option>
                        <option value="IEM SALTLAKE">IEM SALTLAKE</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>
        `;
        return section;
    }

    addMemberBtn.addEventListener('click', () => {
        if (currentMembers < MAX_ADDITIONAL_MEMBERS) {
            currentMembers++;
            membersContainer.appendChild(createMemberSection(currentMembers));
            if (currentMembers >= MAX_ADDITIONAL_MEMBERS) {
                addMemberBtn.disabled = true;
                addMemberBtn.innerText = "Team is full! (6/6 members)";
            }
        }
    });

    window.removeMember = function(index) {
        const memberSection = document.getElementById(`member-${index}`);
        if (memberSection) {
            memberSection.remove();
            currentMembers--;
            addMemberBtn.disabled = false;
            addMemberBtn.innerText = "+ I'll Be There For You (Add Member)";
            
            const remainingSections = document.querySelectorAll('.member-section');
            remainingSections.forEach((section, newIndex) => {
                const updatedIndex = newIndex + 1;
                const charName = friendsNames[updatedIndex - 1];
                section.id = `member-${updatedIndex}`;
                section.querySelector('h2').innerText = `${charName} (Team Member ${updatedIndex + 1})`;
                section.querySelector('.remove-btn').setAttribute('onclick', `removeMember(${updatedIndex})`);
            });
        }
    }

    // --- MAIN REGISTRATION SUBMISSION (GOOGLE SHEETS) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const teamName = document.getElementById('teamName').value.trim();

        const payload = {
            rowNumber: isEditing ? editDocumentId : null, 
            team: {
                name: teamName,
                pin: document.getElementById('teamPin').value,
                timestamp: new Date().toISOString()
            },
            idea: {
                title: document.getElementById('ideaTitle').value,
                description: document.getElementById('ideaDescription').value
            },
            leader: {
                name: document.getElementById('leaderName').value,
                email: document.getElementById('leaderEmail').value,
                department: document.getElementById('leaderDept').value,
                enrollment: document.getElementById('leaderEnroll').value,
                year: document.getElementById('leaderYear').value,
                discord: document.getElementById('leaderDiscord').value,
                contact: document.getElementById('leaderContact').value,
                whatsapp: document.getElementById('leaderWhatsapp').value,
                campus: document.getElementById('leaderCampus').value
            },
            members: []
        };

        document.querySelectorAll('.member-section').forEach(section => {
            payload.members.push({
                name: section.querySelector('.member-name').value,
                department: section.querySelector('.member-dept').value,
                enrollment: section.querySelector('.member-enroll').value,
                year: section.querySelector('.member-year').value,
                discord: section.querySelector('.member-discord').value,
                contact: section.querySelector('.member-contact').value,
                whatsapp: section.querySelector('.member-whatsapp').value,
                campus: section.querySelector('.member-campus').value
            });
        });

        try {
            statusMessage.className = '';
            statusMessage.innerText = isEditing ? 'Updating Google Sheets... Pivot!' : 'Submitting to Google Sheets... Pivot!';
            
            // Notice the new headers here!
            const response = await fetch(GOOGLE_SHEETS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(payload) 
            });
            
            const result = await response.json();

            if (result.result === "success") {
                statusMessage.className = 'success';
                statusMessage.innerText = isEditing ? 'Could this BE any more updated? Changes Saved!' : 'Could this BE any more successful? Team Registered!';
            } else {
                throw new Error(result.error);
            }

            form.reset();
            membersContainer.innerHTML = '';
            currentMembers = 0;
            addMemberBtn.disabled = false;
            addMemberBtn.innerText = "+ I'll Be There For You (Add Member)";
            submitBtn.innerText = "PIVOT! (Submit Idea)"; 
            isEditing = false;
            editDocumentId = null;

        } catch (error) {
            console.error('Submission Error:', error);
            statusMessage.className = 'error';
            statusMessage.innerText = "Uh oh. We were on a break! Check console for details.";
        }
    });

    // --- CHECK REGISTRATION STATUS (HYBRID: CACHE + SHEETS) ---
    document.getElementById('checkForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgBox = document.getElementById('checkStatusMessage');
        const email = document.getElementById('checkEmail').value.trim().toLowerCase();

        msgBox.className = '';
        msgBox.innerText = 'Searching the database...';

        if (legacyTeams[email]) {
            msgBox.className = 'success';
            msgBox.innerHTML = `Found it! Team <strong>${legacyTeams[email]}</strong> is registered! Your registration has already been confirmed.`;
            return;
        }

        try {
            const response = await fetch(`${GOOGLE_SHEETS_API_URL}?email=${encodeURIComponent(email)}`);
            const json = await response.json();

            if (json.result === "not_found") {
                msgBox.className = 'error';
                msgBox.innerText = "No team found with this Leader Email.";
            } else if (json.result === "success") {
                const totalMembers = json.data.members.length + 1;
                msgBox.className = 'success';
                msgBox.innerHTML = `Found it! Team <strong>${json.data.team.name}</strong> is registered with ${totalMembers}/6 members.`;
            } else {
                throw new Error("Server error");
            }
        } catch (error) {
            console.error(error);
            msgBox.className = 'error';
            msgBox.innerText = "Error fetching data.";
        }
    });

    // --- EDIT REGISTRATION (GOOGLE SHEETS API) ---
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editFormRef = document.getElementById('editForm');
        const msgBox = document.getElementById('editStatusMessage');
        const email = document.getElementById('editEmail').value.trim().toLowerCase();
        const pin = document.getElementById('editPin').value;

        try {
            msgBox.className = '';
            msgBox.innerText = 'Verifying credentials with server...';

            const response = await fetch(`${GOOGLE_SHEETS_API_URL}?email=${encodeURIComponent(email)}`);
            const json = await response.json();

            if (json.result === "not_found") {
                msgBox.className = 'error';
                msgBox.innerText = "Leader Email not found.";
                return;
            }

            const teamData = json.data;

            if (teamData.team.pin && String(teamData.team.pin) !== "no-pin" && String(teamData.team.pin) !== String(pin)) {
                msgBox.className = 'error';
                msgBox.innerText = "Incorrect PIN! We were on a break!";
                return;
            } 

            isEditing = true;
            editDocumentId = teamData.rowNumber; 

            document.getElementById('teamName').value = teamData.team.name;
            document.getElementById('teamPin').value = pin; 
            document.getElementById('ideaTitle').value = teamData.idea.title;
            document.getElementById('ideaDescription').value = teamData.idea.description;

            document.getElementById('leaderName').value = teamData.leader.name;
            document.getElementById('leaderEmail').value = teamData.leader.email;
            document.getElementById('leaderDept').value = teamData.leader.department;
            document.getElementById('leaderEnroll').value = teamData.leader.enrollment;
            document.getElementById('leaderYear').value = teamData.leader.year;
            document.getElementById('leaderDiscord').value = teamData.leader.discord;
            document.getElementById('leaderContact').value = teamData.leader.contact;
            document.getElementById('leaderWhatsapp').value = teamData.leader.whatsapp;
            document.getElementById('leaderCampus').value = teamData.leader.campus;

            membersContainer.innerHTML = '';
            currentMembers = 0;
            addMemberBtn.disabled = false;

            teamData.members.forEach((member) => {
                currentMembers++;
                membersContainer.appendChild(createMemberSection(currentMembers));

                const section = document.getElementById(`member-${currentMembers}`);
                section.querySelector('.member-name').value = member.name;
                section.querySelector('.member-dept').value = member.department;
                section.querySelector('.member-enroll').value = member.enrollment;
                section.querySelector('.member-year').value = member.year;
                section.querySelector('.member-discord').value = member.discord;
                section.querySelector('.member-contact').value = member.contact;
                section.querySelector('.member-whatsapp').value = member.whatsapp;
                section.querySelector('.member-campus').value = member.campus;
            });

            if (currentMembers >= MAX_ADDITIONAL_MEMBERS) {
                addMemberBtn.disabled = true;
                addMemberBtn.innerText = "Team is full! (6/6 members)";
            } else {
                addMemberBtn.innerText = "+ I'll Be There For You (Add Member)";
            }

            submitBtn.innerText = "UPDATE PIVOT! (Save Changes)";
            msgBox.className = '';
            msgBox.innerText = '';
            editFormRef.reset();
            
            statusMessage.className = 'success';
            statusMessage.innerText = "Data loaded! You can now edit your details above.";
            document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' });

        } catch (error) {
            console.error(error);
            msgBox.className = 'error';
            msgBox.innerText = "Error verifying data. Check console.";
        }
    });
});