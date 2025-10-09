// --------------------------------------------------------------------------------
// DARK MODE LOGIC
// --------------------------------------------------------------------------------

// This function saves the user's preference and applies the theme
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    const button = document.querySelector(".dark-toggle");
    
    if (document.body.classList.contains("dark-mode")) {
        button.textContent = "☀️ Light Mode";
        localStorage.setItem('darkMode', 'enabled');
    } else {
        button.textContent = "🌙 Dark Mode";
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Check for saved preference when the page loads
(function() {
    const darkToggleButton = document.querySelector(".dark-toggle");
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.body.classList.add("dark-mode");
        if (darkToggleButton) {
            darkToggleButton.textContent = "☀️ Light Mode";
        }
    }
    // Attach listener for the button (if it exists)
    if (darkToggleButton) {
        darkToggleButton.addEventListener('click', toggleDarkMode);
    }
})();


// --------------------------------------------------------------------------------
// SUPABASE AUTH LOGIC - MODIFIED FOR ADMIN-ONLY USER CREATION
// --------------------------------------------------------------------------------

// 🔑 FIX 1: Add Supabase client initialization (REQUIRED)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.40.0/+esm'; 

const SUPABASE_URL = 'https://fbbfesiftzqfxreeclsz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmZlc2lmdHpxZnhyZWVjbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjEzMDAsImV4cCI6MjA3NDQzNzMwMH0.oMExSfXDqM67J4s8FYlhPfbhDP4ZpKeyf9iCZxc53iQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Define HTML elements 
// NOTE: Assuming your form ID is now 'auth-form' as per previous discussion.
const form = document.getElementById('auth-form'); 
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const statusMessage = document.getElementById('status-message');

// Target the whole wrapper for hiding/showing
const loginFormContainer = document.querySelector('.login-content'); 


async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout Error:', error.message);
        statusMessage.textContent = `Logout Error: ${error.message}`;
    } else {
        // After logout, reload to show the login form again
        window.location.reload(); 
    }
}


async function checkUser() {
    // 1. Check for an active session. This is an asynchronous call.
    const { data: { session } } = await supabase.auth.getSession(); 
    
    // Check if the user is logged in
    if (session) {
        // 🔑 FIX: REDIRECT IMMEDIATELY IF LOGGED IN. 
        // This prevents the code from displaying the login form again.
        console.log("User is logged in. Redirecting to dashboard.");
        window.location.href = '/database1.html';
        return; // Stop execution of the rest of the function

        // The welcome message and logout button logic below is now redundant 
        // since we are immediately leaving this page, but you can keep it 
        // if this script is also used on the dashboard page.
        
    } 
    
    // If execution reaches here, the user is NOT logged in.
    
    else {
        // USER IS NOT LOGGED IN: Show form, clear status message
        if (loginFormContainer) loginFormContainer.style.display = 'block';
        if (statusMessage) statusMessage.textContent = '';

        // Attach form submission listener ONLY when not logged in
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                // ... (Login logic is here)
                
                // On SUCCESS: 
                // window.location.href = '/database1.html'; 
            });
        }
    }
}


// 🔑 FIX 2: Move the function call to the very end of the script 
// to ensure the 'supabase' variable is defined first.
checkUser();