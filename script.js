// --- 1. IMPORT FIREBASE ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, doc, setDoc, collection, query, where, getDocs, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// --- 2. YOUR FIREBASE CONFIG ---
// PASTE YOUR DETAILS FROM THE FIREBASE CONSOLE HERE:
const firebaseConfig = {
    apiKey: "AIzaSyDd87f86gL3YsGPGPIbYtUoJxWMBFx8xHs",
    authDomain: "pivot-point-registration.firebaseapp.com",
    projectId: "pivot-point-registration",
    storageBucket: "pivot-point-registration.firebasestorage.app",
    messagingSenderId: "24860503102",
    appId: "1:24860503102:web:aca00d94a82cbf9deb756f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
    
    // --- UI & Navigation Logic ---
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

    // --- Dynamic Form & Edit State Logic ---
    const MAX_ADDITIONAL_MEMBERS = 5; 
    let currentMembers = 0;
    let isEditing = false; // Tracks if we are creating or updating
    let editDocumentId = null; // Stores the specific database ID we are editing
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

    // --- MAIN REGISTRATION SUBMISSION (CREATE OR UPDATE) ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const teamName = document.getElementById('teamName').value.trim();
        // If creating new, generate an ID. If editing, we use the existing editDocumentId.
        const documentId = isEditing ? editDocumentId : teamName.toLowerCase().replace(/\s+/g, '-'); 

        const payload = {
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
            statusMessage.innerText = isEditing ? 'Updating Database... Pivot!' : 'Submitting... Pivot!';
            
            if (isEditing) {
                await updateDoc(doc(db, "registrations", documentId), payload);
                statusMessage.className = 'success';
                statusMessage.innerText = 'Could this BE any more updated? Changes Saved!';
            } else {
                await setDoc(doc(db, "registrations", documentId), payload);
                statusMessage.className = 'success';
                statusMessage.innerText = 'Could this BE any more successful? Team Registered!';
            }

            // Reset everything back to normal mode
            form.reset();
            membersContainer.innerHTML = '';
            currentMembers = 0;
            addMemberBtn.disabled = false;
            addMemberBtn.innerText = "+ I'll Be There For You (Add Member)";
            submitBtn.innerText = "PIVOT! (Submit Idea)"; // Reset button text
            isEditing = false;
            editDocumentId = null;

        } catch (error) {
            console.error('Firebase Error:', error);
            statusMessage.className = 'error';
            statusMessage.innerText = "Uh oh. We were on a break! Check console for details.";
        }
    });

    // --- CHECK REGISTRATION STATUS ---
    document.getElementById('checkForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msgBox = document.getElementById('checkStatusMessage');
        const email = document.getElementById('checkEmail').value.trim();

        try {
            msgBox.className = '';
            msgBox.innerText = 'Searching the database...';

            const q = query(collection(db, "registrations"), where("leader.email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                msgBox.className = 'error';
                msgBox.innerText = "No team found with this Leader Email.";
            } else {
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    const totalMembers = data.members.length + 1; // +1 for the Leader
                    msgBox.className = 'success';
                    msgBox.innerHTML = `Found it! Team <strong>${data.team.name}</strong> is registered with ${totalMembers}/6 members.`;
                });
            }
        } catch (error) {
            console.error(error);
            msgBox.className = 'error';
            msgBox.innerText = "Error fetching data.";
        }
    });

    // --- EDIT REGISTRATION (FETCH & POPULATE MAIN FORM) ---
    document.getElementById('editForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editFormRef = document.getElementById('editForm');
        const msgBox = document.getElementById('editStatusMessage');
        const email = document.getElementById('editEmail').value.trim();
        const pin = document.getElementById('editPin').value;

        try {
            msgBox.className = '';
            msgBox.innerText = 'Verifying credentials...';

            const q = query(collection(db, "registrations"), where("leader.email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                msgBox.className = 'error';
                msgBox.innerText = "Leader Email not found.";
                return;
            }

            let teamData = null;
            let documentId = null;

            querySnapshot.forEach((doc) => {
                teamData = doc.data();
                documentId = doc.id;
            });

            if (teamData.team.pin !== pin) {
                msgBox.className = 'error';
                msgBox.innerText = "Incorrect PIN! We were on a break!";
                return;
            } 

            // --- SUCCESS! POPULATE THE MAIN FORM ---
            
            // 1. Enter Edit State
            isEditing = true;
            editDocumentId = documentId;

            // 2. Populate Team & Idea Data
            document.getElementById('teamName').value = teamData.team.name;
            document.getElementById('teamPin').value = teamData.team.pin;
            document.getElementById('ideaTitle').value = teamData.idea.title;
            document.getElementById('ideaDescription').value = teamData.idea.description;

            // 3. Populate Leader Data
            document.getElementById('leaderName').value = teamData.leader.name;
            document.getElementById('leaderEmail').value = teamData.leader.email;
            document.getElementById('leaderDept').value = teamData.leader.department;
            document.getElementById('leaderEnroll').value = teamData.leader.enrollment;
            document.getElementById('leaderYear').value = teamData.leader.year;
            document.getElementById('leaderDiscord').value = teamData.leader.discord;
            document.getElementById('leaderContact').value = teamData.leader.contact;
            document.getElementById('leaderWhatsapp').value = teamData.leader.whatsapp;
            document.getElementById('leaderCampus').value = teamData.leader.campus;

            // 4. Clear existing member UI and repopulate from database
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

            // Update Add Button State
            if (currentMembers >= MAX_ADDITIONAL_MEMBERS) {
                addMemberBtn.disabled = true;
                addMemberBtn.innerText = "Team is full! (6/6 members)";
            } else {
                addMemberBtn.innerText = "+ I'll Be There For You (Add Member)";
            }

            // 5. Change Main Submit Button
            submitBtn.innerText = "UPDATE PIVOT! (Save Changes)";

            // 6. Provide feedback and scroll up
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