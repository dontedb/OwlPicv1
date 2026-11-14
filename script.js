// OWL PIC - BUILD THE LOOK
// Beginner voting demo using browser storage.

// Each category has three choices.
// Replace the emoji with product images later.

const categories = [
    {
        id: "shirts",
        name: "Shirts",
        icon: "👕",
        items: [
            { id: "shirt1", name: "Black Graphic Tee", emoji: "👕", image: "" },
            { id: "shirt2", name: "White Graphic Tee", emoji: "👕", image: "" },
            { id: "shirt3", name: "Red Graphic Tee", emoji: "👕", image: "" }
        ]
    },
    {
        id: "hats",
        name: "Hats",
        icon: "🧢",
        items: [
            { id: "hat1", name: "Black Cap", emoji: "🧢", image: "" },
            { id: "hat2", name: "Blue Cap", emoji: "🧢", image: "" },
            { id: "hat3", name: "Purple Cap", emoji: "🧢", image: "" }
        ]
    },
    {
        id: "jackets",
        name: "Jackets",
        icon: "🧥",
        items: [
            { id: "jacket1", name: "Black Jacket", emoji: "🧥", image: "" },
            { id: "jacket2", name: "Red Jacket", emoji: "🧥", image: "" },
            { id: "jacket3", name: "Sport Jacket", emoji: "🧥", image: "" }
        ]
    },
    {
        id: "pants",
        name: "Pants",
        icon: "👖",
        items: [
            { id: "pants1", name: "Black Cargo Pants", emoji: "👖", image: "" },
            { id: "pants2", name: "Gray Sweatpants", emoji: "👖", image: "" },
            { id: "pants3", name: "Black Joggers", emoji: "👖", image: "" }
        ]
    },
    {
        id: "gloves",
        name: "Football Gloves",
        icon: "🏈",
        items: [
            { id: "gloves1", name: "Black Gloves", emoji: "🧤", image: "" },
            { id: "gloves2", name: "White Gloves", emoji: "🧤", image: "" },
            { id: "gloves3", name: "Red Gloves", emoji: "🧤", image: "" }
        ]
    },
    {
        id: "cleats",
        name: "Football Cleats",
        icon: "🏈",
        items: [
            { id: "cleats1", name: "Black Cleats", emoji: "👟", image: "" },
            { id: "cleats2", name: "White Cleats", emoji: "👟", image: "" },
            { id: "cleats3", name: "Red Cleats", emoji: "👟", image: "" }
        ]
    },
    {
        id: "socks",
        name: "Socks",
        icon: "🧦",
        items: [
            { id: "socks1", name: "White Socks", emoji: "🧦", image: "" },
            { id: "socks2", name: "Black Socks", emoji: "🧦", image: "" },
            { id: "socks3", name: "Sport Socks", emoji: "🧦", image: "" }
        ]
    },
    {
        id: "shoes",
        name: "Shoes",
        icon: "👟",
        items: [
            { id: "shoes1", name: "White Sneakers", emoji: "👟", image: "" },
            { id: "shoes2", name: "Black Sneakers", emoji: "👟", image: "" },
            { id: "shoes3", name: "Red Sneakers", emoji: "👟", image: "" }
        ]
    }
];

// Music is voted on separately from the outfit.
const songs = [
    { id: "song1", title: "Song Choice One", artist: "Artist Name" },
    { id: "song2", title: "Song Choice Two", artist: "Artist Name" },
    { id: "song3", title: "Song Choice Three", artist: "Artist Name" }
];

const STORAGE_KEY = "owlPicVotingDemo";

// Load votes saved in this browser.
let savedData;

try {
    savedData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
} catch (error) {
    savedData = {};
}

const votes = savedData.votes || {};
const selectedVotes = savedData.selectedVotes || {};
const musicVotes = savedData.musicVotes || {};
let selectedSong = savedData.selectedSong || null;

// Save the voting information.
function saveVotes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        votes,
        selectedVotes,
        musicVotes,
        selectedSong
    }));
}

// Find a product using its ID.
function findProduct(productId) {
    for (const category of categories) {
        const product = category.items.find(item => item.id === productId);

        if (product) {
            return product;
        }
    }

    return null;
}

// Display an image if supplied, otherwise show an emoji.
function imageHTML(item) {
    if (item.image) {
        return `
            <img
                src="${item.image}"
                alt="${item.name}"
                onerror="this.style.display='none'; this.parentElement.textContent='${item.emoji}'"
            >
        `;
    }

    return item.emoji;
}

// Create the category voting cards.
function displayCategories() {
    const container = document.getElementById("categories");

if (!container) return;

container.innerHTML = "";

    categories.forEach(category => {
        const card = document.createElement("div");
        card.className = "category-card";

        card.innerHTML = `
            <div class="category-title">
                <span class="category-icon">${category.icon}</span>
                <div>
                    <h3>${category.name}</h3>
                    <p>Vote for your favorite</p>
                </div>
            </div>

            <div class="product-options">
                ${category.items.map(item => {
                    const count = votes[item.id] || 0;
                    const alreadyVoted = selectedVotes[category.id] === item.id;

                    return `
                        <div class="product ${alreadyVoted ? "selected" : ""}">
                            <div class="product-image">
                                ${imageHTML(item)}
                            </div>

                            <h4>${item.name}</h4>

                            <div class="vote-count">
                                ❤️ ${count}
                            </div>

                            <button
                                class="vote-button"
                                onclick="voteForProduct('${category.id}', '${item.id}')"
                            >
                                ${alreadyVoted ? "✓ Voted" : "❤️ Vote"}
                            </button>
                        </div>
                    `;
                }).join("")}
            </div>
        `;

        container.appendChild(card);
    });
}

// Vote for a product.
// A visitor gets one active vote per category.
// They can change their vote later.
// REQUIRE LOGIN BEFORE PRODUCT VOTING

// REQUIRE LOGIN BEFORE PRODUCT VOTING

async function voteForProduct(categoryId, productId) {

    const loggedIn = await checkUserLogin();

    if (!loggedIn) return;

    const previousVote = selectedVotes[categoryId];

    if (previousVote === productId) {
        return;
    }

    if (previousVote) {
        votes[previousVote] = Math.max(
            0,
            (votes[previousVote] || 0) - 1
        );
    }

    votes[productId] = (votes[productId] || 0) + 1;

    selectedVotes[categoryId] = productId;

    saveVotes();
    displayCategories();
    displayWinningLook();
    displayOutfitPreview();
}

  
// Find the most-liked item in a category.
// If there is a tie, the first item in the list wins.
function getWinner(category) {
    let winner = category.items[0];

    category.items.forEach(item => {
        if ((votes[item.id] || 0) > (votes[winner.id] || 0)) {
            winner = item;
        }
    });

    return winner;
}

// Display the winning item from every category.
function displayWinningLook() {
   const container = document.getElementById("winning-look");

if (!container) return;

container.innerHTML = "";

    categories.forEach(category => {
        const winner = getWinner(category);

        const winnerCard = document.createElement("div");
        winnerCard.className = "winning-item";

        winnerCard.innerHTML = `
            <div class="product-image">
                ${imageHTML(winner)}
            </div>

            <div>
                <h4>${category.name}</h4>
                <p>${winner.name} • ❤️ ${votes[winner.id] || 0} votes</p>
            </div>
        `;

        container.appendChild(winnerCard);
    });

    const total = Object.values(votes).reduce(
        (sum, count) => sum + count,
        0
    );

    document.getElementById("total-votes").textContent =
        `Total votes: ${total}`;
}

function displayOutfitPreview() {
    const container = document.getElementById("outfit-preview-items");

    if (!container) return;

    container.innerHTML = "";

    container.innerHTML = "";

    categories.forEach(category => {
        const selectedProductId = selectedVotes[category.id];

        if (!selectedProductId) return;

        const product = findProduct(selectedProductId);

        if (!product) return;

        const item = document.createElement("div");

        item.className = `outfit-item outfit-${category.id}`;

        item.innerHTML = `
            <div class="outfit-product-image">
                ${imageHTML(product)}
            </div>
            <p>${product.name}</p>
        `;

        container.appendChild(item);
    });
}

// Display music voting cards.
function displayMusic() {
    const container = document.getElementById("music-list");

    if (!container) return;

    container.innerHTML = "";

    songs.forEach(song => {
        const count = musicVotes[song.id] || 0;
        const alreadyVoted = selectedSong === song.id;

        const card = document.createElement("div");
        card.className = "music-card";

        card.innerHTML = `
            <div class="music-note">🎵</div>
            <h3>${song.title}</h3>
            <p>${song.artist}</p>

            <div class="vote-count">
                ❤️ ${count} votes
            </div>

            <button
                class="vote-button"
                onclick="voteForSong('${song.id}')"
            >
                ${alreadyVoted ? "✓ Voted" : "❤️ Vote"}
            </button>
        `;

        container.appendChild(card);
    });
}

// One active music vote per visitor in this browser.
// REQUIRE LOGIN BEFORE MUSIC VOTING

async function voteForSong(songId) {

    const loggedIn = await checkUserLogin();

    if (!loggedIn) return;

    if (selectedSong === songId) {
        return;
    }

    if (selectedSong) {
        musicVotes[selectedSong] = Math.max(
            0,
            (musicVotes[selectedSong] || 0) - 1
        );
    }

    musicVotes[songId] =
        (musicVotes[songId] || 0) + 1;

    selectedSong = songId;

    saveVotes();
    displayMusic();
}
   

// Start the website.
// Start the website.
displayCategories();
displayWinningLook();
displayOutfitPreview();
displayMusic();
// OWL PIC - SUPABASE CONNECTION

const SUPABASE_URL = "https://djustjxfcfexlysqgdyq.supabase.co";

const SUPABASE_ANON_KEY = "sb_publishable_uo5uRAaC1mCk1txpLXPCOQ_47T7qk2A";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

console.log("OWL PIC connected to Supabase!");
// OWL PIC - CHECK USER LOGIN

async function checkUserLogin() {
    const { data: { user } } =
        await supabaseClient.auth.getUser();

    if (!user) {
        const returnTo =
            window.location.pathname +
            window.location.search +
            window.location.hash;

        window.location.href =
            "auth.html?returnTo=" +
            encodeURIComponent(returnTo);

        return false;
    }

    return true;
}
// OWL PIC - CREATE ACCOUNT

document.getElementById("signup-form")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const username = document.getElementById("display-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username
            }
        }
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Welcome to OWL PIC! Check your email to confirm your account.");
        console.log(data);
    }
});
// OWL PIC - SIGN IN EXISTING USER

document.getElementById("signin-form")?.addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        alert(error.message);
    } else {
        alert("Welcome back to OWL PIC!");

        console.log("User signed in:", data.user);

        const returnTo =
    new URLSearchParams(window.location.search)
    .get("returnTo");

window.location.href =
    returnTo && returnTo.startsWith("/")
        ? returnTo
        : "index.html";
    }
});



// =====================================
// OWL PIC - MY CLOSET UPLOAD SYSTEM
// =====================================

// Find the user's closet or create one.
async function getOrCreateUserCloset(userId) {
    const { data: existingCloset, error } =
        await supabaseClient
            .from("closets")
            .select("id")
            .eq("owner_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

    if (error) throw error;

    if (existingCloset) {
        return existingCloset;
    }

    const { data: newCloset, error: createError } =
        await supabaseClient
            .from("closets")
            .insert({
                owner_id: userId,
                title: "My Closet",
                description: "My OWL PIC clothing collection",
                status: "open"
            })
            .select("id")
            .single();

    if (createError) throw createError;

    return newCloset;
}


// Upload clothing when the form is submitted.
document.getElementById("closet-upload-form")
    ?.addEventListener("submit", async function(event) {

        event.preventDefault();

        const loggedIn = await checkUserLogin();

        if (!loggedIn) return;

        const { data: { user }, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {
            alert("Please sign in before uploading clothing.");
            return;
        }

        const name =
            document.getElementById("clothing-name").value.trim();

        const category =
            document.getElementById("clothing-category").value;

        const file =
            document.getElementById("clothing-photo").files[0];

        if (!name || !category || !file) {
            alert("Please complete all fields and select a photo.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Please choose an image smaller than 5 MB.");
            return;
        }

        const form = event.currentTarget;
        const button = form.querySelector('button[type="submit"]');

        button.disabled = true;
        button.textContent = "UPLOADING...";

        let uploadedPath = null;

        try {
            // Find or create this user's closet.
            const closet = await getOrCreateUserCloset(user.id);

            // Prepare a unique image filename.
            const extension =
                file.name.split(".").pop().toLowerCase()
                    .replace(/[^a-z0-9]/g, "") || "jpg";

            const fileName =
                Date.now() + "-" +
                Math.random().toString(36).slice(2) +
                "." + extension;

            // Save the image in the private Supabase bucket.
            uploadedPath =
                `${user.id}/${closet.id}/${fileName}`;

            const { error: uploadError } =
                await supabaseClient.storage
                    .from("closet-images")
                    .upload(uploadedPath, file, {
                        cacheControl: "3600",
                        upsert: false,
                        contentType: file.type
                    });

            if (uploadError) throw uploadError;

            // Save the clothing details in the database.
            const { error: itemError } =
                await supabaseClient
                    .from("closet_items")
                    .insert({
                        closet_id: closet.id,
                        owner_id: user.id,
                        category: category,
                        name: name,
                        image_url: uploadedPath
                    });

            if (itemError) throw itemError;

            alert("Your clothing was added to My Closet!");

            form.reset();

            await displayMyCloset();

// =====================================


        } catch (error) {
            console.error("Look upload error:", error);

            if (imagePath) {
                await supabaseClient.storage
                    .from("look-posts")
                    .remove([imagePath]);
            }

            alert("Upload failed: " + error.message);

        } finally {
            button.disabled = false;
            button.textContent = "SHARE MY LOOK";
        }
    });

// =====================================
// END SHOW OFF YOUR LOOK UPLOAD
// =====================================

        } catch (error) {
            console.error("Closet upload error:", error);

            // Remove the image if its database record failed.
            if (uploadedPath) {
                await supabaseClient.storage
                    .from("closet-images")
                    .remove([uploadedPath]);
            }

            alert("Upload failed: " + error.message);

        } finally {
            button.disabled = false;
            button.textContent = "UPLOAD TO MY CLOSET";
        }
    });


// Display clothing saved in the user's closet.
async function displayMyCloset() {
    const container =
        document.getElementById("my-closet-items");

    if (!container) return;

    const { data: { user }, error: userError } =
        await supabaseClient.auth.getUser();

    if (userError || !user) {
        container.textContent =
            "Sign in to view your clothing collection.";
        return;
    }

    try {
        const { data: closet, error: closetError } =
            await supabaseClient
                .from("closets")
                .select("id")
                .eq("owner_id", user.id)
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

        if (closetError) throw closetError;

        if (!closet) {
            container.textContent =
                "Your closet is ready. Upload your first item!";
            return;
        }

        const { data: items, error: itemsError } =
            await supabaseClient
                .from("closet_items")
                .select("id, name, category, image_url")
                .eq("closet_id", closet.id)
                .order("created_at", { ascending: false });

        if (itemsError) throw itemsError;

        container.innerHTML = "";

        if (!items || items.length === 0) {
            container.textContent =
                "Your closet is empty. Upload your first item!";
            return;
        }

        for (const item of items) {
            const { data: imageData, error: imageError } =
                await supabaseClient.storage
                    .from("closet-images")
                    .createSignedUrl(item.image_url, 3600);

            const card = document.createElement("div");
            card.className = "closet-item-card";

            if (!imageError && imageData?.signedUrl) {
                const image = document.createElement("img");
                image.src = imageData.signedUrl;
                image.alt = item.name;
                card.appendChild(image);
            }

            const itemName = document.createElement("h4");
            itemName.textContent = item.name;
            card.appendChild(itemName);

            const itemCategory = document.createElement("p");
            itemCategory.textContent = item.category;
            card.appendChild(itemCategory);

            container.appendChild(card);
        }

    } catch (error) {
        console.error("Could not load closet:", error);
        container.textContent =
            "We couldn't load your closet. Please try again.";
    }
}


// Load the closet when the page opens.
displayMyCloset();
// OWL PIC - SHOW OFF YOUR LOOK UPLOAD
// =====================================

document.getElementById("look-upload-form")
    ?.addEventListener("submit", async function(event) {

        event.preventDefault();

        // Require the member to sign in.
        const loggedIn = await checkUserLogin();

        if (!loggedIn) return;

        const { data: { user }, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {
            alert("Please sign in before sharing your look.");
            return;
        }

        const file = document.getElementById("look-photo").files[0];
        const caption = document.getElementById("look-caption").value.trim();
        const visibility = document.getElementById("look-visibility").value;

        if (!file) {
            alert("Please choose an outfit photo.");
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Your photo must be 5 MB or smaller.");
            return;
        }

        const form = event.currentTarget;
        const button = form.querySelector('button[type="submit"]');

        button.disabled = true;
        button.textContent = "UPLOADING...";

        let imagePath = null;

        try {
            // Create a unique post and image path.
            const postId = crypto.randomUUID();
            const extension =
                file.name.split(".").pop().toLowerCase()
                    .replace(/[^a-z0-9]/g, "") || "jpg";

            const fileName = Date.now() + "." + extension;

            imagePath = `${user.id}/${postId}/${fileName}`;

            // Upload photo to the private look-posts bucket.
            const { error: uploadError } =
                await supabaseClient.storage
                    .from("look-posts")
                    .upload(imagePath, file, {
                        upsert: false,
                        contentType: file.type
                    });

            if (uploadError) throw uploadError;

            // Save the look in the database.
            const { error: postError } =
                await supabaseClient
                    .from("look_posts")
                    .insert({
                        id: postId,
                        user_id: user.id,
                        closet_id: null,
                        caption: caption,
                        image_path: imagePath,
                        visibility: visibility
                    });

            if (postError) throw postError;

            alert("Your look has been shared!");

            form.reset();

            await displayLookGallery();

        } catch (error) {
            console.error("Look upload error:", error);

            if (imagePath) {
                await supabaseClient.storage
                    .from("look-posts")
                    .remove([imagePath]);
            }

            alert("Upload failed: " + error.message);

        } finally {
            button.disabled = false;
            button.textContent = "SHARE MY LOOK";
        }
    });

// =====================================
// END SHOW OFF YOUR LOOK UPLOAD
// =====================================

// =====================================
// OWL PIC - COMMUNITY LOOKS GALLERY
// =====================================

async function displayLookGallery() {

    const container = document.getElementById("look-gallery");

    if (!container) return;

    container.innerHTML = "Loading community looks...";

    try {

        // Retrieve posts the current viewer is allowed to see.
        const { data: posts, error } = await supabaseClient
            .from("look_posts")
            .select("id, user_id, caption, image_path, visibility, created_at")
            .order("created_at", { ascending: false });

        if (error) throw error;

        container.innerHTML = "";

        if (!posts || posts.length === 0) {
            container.textContent =
                "No community looks yet. Be the first to share your style!";
            return;
        }

        // Display each permitted outfit photo.
        for (const post of posts) {

            const { data: imageData, error: imageError } =
                await supabaseClient.storage
                    .from("look-posts")
                    .createSignedUrl(post.image_path, 3600);

            const card = document.createElement("div");
            card.className = "look-card";

            if (!imageError && imageData?.signedUrl) {

                const image = document.createElement("img");
                image.src = imageData.signedUrl;
                image.alt = "OWL PIC community outfit";
                image.loading = "lazy";

                card.appendChild(image);

            } else {
                continue;
            }

            const caption = document.createElement("p");
            caption.textContent = post.caption || "Check out my look!";

            card.appendChild(caption);

            container.appendChild(card);
        }

        if (container.children.length === 0) {
            container.textContent =
                "No outfit photos are available right now.";
        }

    } catch (error) {

        console.error("Community gallery error:", error);

        container.textContent =
            "Unable to load community looks. Please try again.";

    }
}

// Load community looks when the page opens.
displayLookGallery();

// =====================================
// END COMMUNITY LOOKS GALLERY
// =====================================
