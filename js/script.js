// --------------------------------------------------------------------------------
// DARK MODE LOGIC (No changes needed)
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

// FIX: Supabase client initialization (Should be placed before it's used)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.40.0/+esm'; 

const SUPABASE_URL = 'https://fbbfesiftzqfxreeclsz.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiYmZlc2lmdHpxZnhyZWVjbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4NjEzMDAsImV4cCI6MjA3NDQzNzMwMH0.oMExSfXDqM67J4s8FYlhPfbhDP4ZpKeyf9iCZxc53iQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Define HTML elements 
const form = document.getElementById('login-form'); 
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
    // 1. Check for an active session.
    const { data: { session } } = await supabase.auth.getSession(); 
    
    // Check if the user is logged in
    if (session) {
        // FIX: REDIRECT IMMEDIATELY IF LOGGED IN. 
        console.log("User is logged in. Redirecting to dashboard.");
        window.location.href = '/database1.html';
        return; // Stop execution
    } 
    
    // If execution reaches here, the user is NOT logged in.
    else {
        // USER IS NOT LOGGED IN: Show form, clear status message
        if (loginFormContainer) loginFormContainer.style.display = 'block';
        if (statusMessage) statusMessage.textContent = '';

        // Attach form submission listener
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // 🔑 FIX: Retrieve input values inside the event listener
                const email = emailInput.value;
                const password = passwordInput.value;
                // Removed buttonId check as only one button (Login) exists

                statusMessage.textContent = 'Logging in...';

                // Attempt Sign-In (Login Only)
                let { data, error } = await supabase.auth.signInWithPassword({ email, password });
                
                // Handle Errors
                if (error) {
                    statusMessage.textContent = `Error: ${error.message}`;
                    console.error('Authentication Error:', error);
                } else {
                    // SUCCESSFUL LOGIN: Redirect the user!
                    window.location.href = './database1.html'; 
                }
            });
        }
    }
}


// FIX: The function call is moved here, ensuring 'supabase' is defined.

checkUser();
