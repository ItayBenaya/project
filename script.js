
async function handleLogin(username,password) {

    // Automatically log the user in after successful signup
    const loginResponse = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });


    return loginResponse;

}


document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
    const loginForm = document.getElementById('login-form');

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
    
            try {
                const signupResponse = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });
    
    
                if (signupResponse.ok) {
                    // Automatically log the user in after successful signup    
                    loginResponse = await handleLogin(username,password);

                    if (loginResponse.ok) {
                        // Parse the response to get the token
                        const loginResult = await loginResponse.json();
                        const token = loginResult.token;
    
                        // Store the token in localStorage or sessionStorage
                        localStorage.setItem('authToken', token);
    
                        // Redirect to the main page with token stored
                        window.location.href = '/';  // Adjust URL as needed
                    } else {
                        // Print login error message
                        const loginResult = await loginResponse.json();
                        const label = '<label for="message" style="color:red;">Login Error: ' + loginResult.message + '</label>';
                        document.getElementById('signup-result').innerHTML = label;
                    }
    
                } else {
                    // Print signup error message
                    const signupResult = await signupResponse.json();
                    const label = '<label for="message" style="color:red;">Signup Error: ' + signupResult.message + '</label>';
                    document.getElementById('signup-result').innerHTML = label;
                }
    
            } catch (error) {
                console.error('Error:', error);
                alert("Runtime Error: " + error);
            }
        });
    
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                loginResponse = await handleLogin(username,password);

                if (loginResponse.ok) {
                            // Parse the response to get the token
                    const loginResult = await loginResponse.json();
                    const token = loginResult.token;

                    // Store the token and user information in localStorage
                    localStorage.setItem('authToken', token);

                    // Redirect to the main page with token stored
                    window.location.href = '/';  // Adjust URL as needed
                } else {
                    const loginResult = await loginResponse.json();
                    const label = '<label for="message" style="color:red;">Login Error: ' + loginResult.message + '</label>';
                    document.getElementById('login-result').innerHTML = label;
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.getElementById('signOutBtn');
    const userDisplay = document.getElementById('userDisplay');

    if (signOutBtn) {
        signOutBtn.addEventListener('click', () => {
            // Clear localStorage
            localStorage.setItem('authToken', '');
            localStorage.setItem('authUser', '');

            // Update user display
            if (userDisplay) {
                userDisplay.textContent = 'User: GUEST';
            }

            // Log for debugging
            console.log('User signed out. Redirecting to home page...');

            // Redirect to home page
            window.location.href = '/'; // Adjust this URL as needed
        });
    }

    // Update user display on page load
    function updateUserDisplay() {
        const isSignin = localStorage.getItem('isSignin') === 'true';
        const username = localStorage.getItem('authUser') || 'GUEST';

        if (userDisplay) {
            userDisplay.textContent = `User: ${isSignin ? username : 'GUEST'}`;
        }
    }

    updateUserDisplay();
});


function tryAgainQuiz(quizLevel) {
    const url = '/quiz' + quizLevel + '.html';
    window.location.href = url;
}

function getCurrentScore() {
    const checkedInputs = document.querySelectorAll('.one-a:checked, .two-c:checked, .three-c:checked, .four-b:checked, .five-a:checked');

    currentScore = checkedInputs.length * 10;
    console.log("getCurrentScore: res=",currentScore)
    return currentScore;
}

function updateQuizResults(){

    score = getCurrentScore();

    level = getCurrentQuizLevel();

    username = localStorage.getItem('authUser');

    authToken = localStorage.getItem('authToken');

    if(username == 'GUEST' || authToken == ''){
        alert("Please Signin for saving your results")
        return;
    }

    console.log('submitLevelupForm: username:'+username+ ' score'+score + " ' level:"+level)

    postLevelup(username,level,score)
    
}

function updateCurrentQuizLevel(level){
    localStorage.setItem('currentQuizLevel', level);
}

function getCurrentQuizLevel(){
    level = localStorage.getItem('currentQuizLevel');
    return level;
}

async function postLevelup(username,levelSuccess,levelScore) {

    fetch('/api/auth/levelup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('authToken')
        },
        body: JSON.stringify({
          username: username,
          levelSuccess: parseInt(levelSuccess),
          levelScore: parseInt(levelScore)
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.token) {
            // Store the new token
            localStorage.setItem('authToken', data.token);
        
            // Redirect to the main page with token stored
            window.location.href = '/';  // Adjust URL as needed

        } else {
            console.error('Error:', data.messag);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

}
