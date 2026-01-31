let form1 = document.querySelector("#platformSelection");
let form2 = document.querySelector("#usernameInput");
let inputPlatformsId = [];

async function fetchCodeforcesData(handle) {
    try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}&checkHistoricHandles=false`);

        const data = await response.json();

        if(data.status === "FAILED") {
            throw new Error("Invalid Codeforces handle");
        }

        return data.result[0];
    } catch (err) {
        console.error("Codeforces fetch failed", err.message);
        return null;
    }
}

inputPlatformsId = [];
form2.innerHTML = "";

form1.addEventListener("submit" , function (event) {
    event.preventDefault();
    console.log("Form-1 submitted");

    let selectedCheckBoxes = document.querySelectorAll("input[name='platform[]']:checked");
    
        
    let selectedPlatforms = [];
    selectedCheckBoxes.forEach(checkBox => {
        selectedPlatforms.push(checkBox.value);
    });
    
    if(selectedPlatforms.length == 0) alert("Select atleast one of the platforms");
    else {
        let mainDiv = document.createElement("div");
        for(let platform of selectedPlatforms) {
            let input = document.createElement("input");
            let label = document.createElement("label");

            input.type="text";
            input.placeholder = `Your ${platform} Username`
            input.id = `${platform}_username`
            input.name = "username[]"

            inputPlatformsId.push(input.id);
            
            label.setAttribute("for" , input.id);
            label.textContent = `${platform} Username: `
            
            let subDiv = document.createElement("div");
            subDiv.appendChild(label);
            subDiv.appendChild(input);
            
            let br = document.createElement("br")
            mainDiv.appendChild(subDiv);
            mainDiv.appendChild(br);
        }

        let submitBtn = document.createElement("button");
        submitBtn.type = "submit"
        submitBtn.innerText = "Submit"

        form2.appendChild(mainDiv);
        form2.appendChild(submitBtn);
        
        form1.classList.add("hidden");
        form2.classList.remove("hidden");
    }
}); 

let inputUsernames = {};

let dashboard = document.querySelector("#dashboard");
form2.addEventListener("submit" , function(event) {
    event.preventDefault();
    inputUsernames = {};
    console.log("Form-2 submitted");

    // fetch all text-input values
    for(let id of inputPlatformsId) {
        let inputBtn = document.querySelector(`#${id}`)
        let platform = id.replace("_username","");

        if(inputBtn.value.trim().length == 0) {
            alert("Please fill all usernames");
            return;
        }

        inputUsernames[platform] = inputBtn.value.trim();
    }

    localStorage.setItem("codingProfiles" , JSON.stringify(inputUsernames));
    const savedProfiles = JSON.parse(localStorage.getItem("codingProfiles"));
    console.log(savedProfiles);

    if(savedProfiles && savedProfiles["codeforces"]) {
        
    }

    form2.classList.add("hidden");
    dashboard.classList.remove("hidden")
    dashboard.innerHTML = "<h3>Your Coding Dashboard</h3>";

    let secDiv = document.createElement("div");
    secDiv.id = "otherPlatforms";
    let otherplatformsPresent = false;

    for(let platform in savedProfiles) {
        if(platform !== "codeforces") otherplatformsPresent = true;
        let cardDiv = document.createElement("div");
        let linktoProfile = document.createElement("a");
        linktoProfile.innerText = "Go to Profile";
        linktoProfile.target = "_blank";

        cardDiv.classList.add("card");
        cardDiv.id = `${platform}`;
        cardDiv.innerHTML = `<h3>${platform}:</h3>`;
        if(platform === "codeforces") {
            fetchCodeforcesData(savedProfiles["codeforces"])
            .then(user => {
                if(!user) return;

                let handle = document.createElement("p");
                handle.innerHTML = `<b>Handle: </b> ${user.handle}`

                let maxRating = document.createElement("p");
                maxRating.innerHTML = `<b>Max Rating: </b>${user.maxRating}`

                let maxRank = document.createElement("p");
                maxRank.innerHTML = `<b>Max Rank: </b>${user.maxRank}`;

                let currRating = document.createElement("p");
                currRating.innerHTML = `<b>Current-Rating: </b>${user.rating}`;

                let currRank = document.createElement("p");
                currRank.innerHTML = `<b>Current-Rank: </b>${user.rank}`;
                
                linktoProfile.setAttribute("href" , `https://codeforces.com/profile/${user.handle}`)
                
                cardDiv.appendChild(handle);
                cardDiv.appendChild(maxRating);
                cardDiv.appendChild(maxRank);
                cardDiv.appendChild(currRating);
                cardDiv.appendChild(currRank);
                cardDiv.appendChild(linktoProfile);

                dashboard.appendChild(cardDiv);
            });
        } 
        else if(platform === "leetcode") {
            linktoProfile.setAttribute("href" , `https://leetcode.com/${savedProfiles["leetcode"]}/`)

            cardDiv.appendChild(linktoProfile);
            cardDiv.style.height = "90px";
            cardDiv.style.width = "20vw";
            cardDiv.style.marginRight = "5px";
            secDiv.appendChild(cardDiv);
        } 
        else if(platform === "codechef") {
            linktoProfile.setAttribute("href" , `https://www.codechef.com/users/${savedProfiles["codechef"]}`)

            cardDiv.appendChild(linktoProfile);
            cardDiv.style.height = "90px";
            cardDiv.style.width = "20vw";
            cardDiv.style.marginRight = "5px";
            secDiv.appendChild(cardDiv);
        }
        else {
            linktoProfile.setAttribute("href" , `https://www.geeksforgeeks.org/profile/${savedProfiles["geeksforgeeks"]}`)
            
            cardDiv.appendChild(linktoProfile);
            cardDiv.style.height = "90px";
            cardDiv.style.width = "20vw";
            cardDiv.style.marginRight = "5px";
            secDiv.appendChild(cardDiv);
        }
    }

    if(otherplatformsPresent) dashboard.appendChild(secDiv);
});