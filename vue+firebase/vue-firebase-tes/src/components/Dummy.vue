<script setup>
import { useAuthStore } from '../stores/counter';
import { firestoreDB } from '../firebase/firebase';
import { doc, addDoc, setDoc, getDoc, collection, query, where, getDocs, arrayUnion, updateDoc, onSnapshot } from "firebase/firestore";
import { computed, onMounted, ref, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userPageStore';
import ProfileImage from './ProfileImage.vue';



const text = ref('')
const messages = ref([]);
const route = useRoute();
const selectedChat = ref(route.params.id || null);
const allChats = ref([]);
const router = useRouter();

const sortedMessages = computed(() => messages.value.length > 1 ? messages.value.sort((a, b) => a.author?.date - b.author?.date) : messages.value);

const onChatSelected = async (user) => {
    if (!user[0]) return;
    const currentUserID = useAuthStore().authUser.uid;
    const currentChat = doc(firestoreDB, "users", currentUserID, "chats", user[0]);
    selectedChat.value = user[1];
    const currentChatSnap = await getDoc(currentChat);
    console.log(currentChatSnap.data().messages)
    messages.value = currentChatSnap.data().messages;
}


const onMessageSent = async () => {
    if (!text.value.length) return;

    const currentUserID = useAuthStore().authUser.uid;
    const photo = useAuthStore().authUser.photoURL;
    const name = useAuthStore().authUser.displayName;
    const messageRef = await getDocs(query(collection(firestoreDB, "users", currentUserID, "chats")));
    const currentChat = doc(firestoreDB, "users", currentUserID, "chats", selectedChat.value.uid);

    const createOrUpdateGuestChat = doc(firestoreDB, "users", selectedChat.value.uid, "chats", currentUserID);
    const currentChatSnap = await getDoc(currentChat);
    const message = {
        text: text.value,
        id: uuidv4(),
        author: {
            userID: currentUserID,
            photo,
            name,
            date: Date.now(),
        }
    };

    if (reply.value) {
        message.reply = reply.value;

    }

    if (currentChatSnap.exists() && text.value) {
        updateDoc(currentChat, {
            lastMessage: message,
            messages: arrayUnion(message)
        }).then(() => {
            text.value = '';

        })

        await updateDoc(createOrUpdateGuestChat, {
            lastMessage: message,
            messages: arrayUnion(message)
        })
    } else {
        await setDoc(currentChat, {
            lastMessage: message,
            chatID: uuidv4(),
            messages: [message]
        }).then(() => {
            text.value = '';
        })

        await setDoc(createOrUpdateGuestChat, {
            lastMessage: message,
            chatID: uuidv4(),
            messages: [message]
        })
    }
    reply.value = null;

    messageRef.forEach(s => {
        console.log(s.data(), 'data');
    })
}
const messenger = ref()
const reply = ref();


const onReply = (message) => {
    const messageText = message.text.length > 30 ? message.text.slice(0, 30) + "..." : message.text;
    reply.value = {
        ...message,
        text: messageText,
    };
}

watch(messages, async (newVal) => {
    // canScroll.value = true;
    // messenger.value.scrollIntoView({ behavior: 'smooth' });
    // setTimeout(() => {
    //     canScroll.value = false;
    // }, 2000)
})

onMounted(async () => {
    console.log(route.params.id)
    await useAuthStore().setUser()
    const userID = useAuthStore().authUser.uid;

    if (route.params.id) {

        const chatREF = doc(firestoreDB, `users`, userID, 'chats', route.params.id);
        const guestChatREF = doc(firestoreDB, `users`, route.params.id, 'chats', userID);
        const isChat = await getDoc(chatREF);

        if (!isChat.exists()) {
            await setDoc(chatREF, {
                chatID: uuidv4(),
                messages: ['']
            });

            await setDoc(guestChatREF, {
                chatID: uuidv4(),
                messages: ['']
            });
        }
    }

    const chatsRef = await collection(firestoreDB, `users`, userID, 'chats');
    const chatList = await getDocs(chatsRef);

    chatList.forEach(async (chat) => {
        console.log(chat.data()), '!!!';
        useUserStore().setChats(chat.id, chat.data().lastMessage);
    })

    allChats.value = await useUserStore().chats;

    const unSub = onSnapshot(chatsRef, (snap) => {
        let updatedChats = [];
        snap.forEach((el, i) => {
            console.log(el.data().lastMessage);
            useUserStore().setChats(el.id, el.data().lastMessage);
            updatedChats.push(el.data().messages);


            messages.value = el.data().messages;
        })


    })
});
const canScroll = ref(true);
const inputRef = ref();

const inputSearch = async () => {
    const usersRef = collection(firestoreDB, 'users');
    const users = await getDocs(usersRef);
    users.forEach(user => {
        console.log(user.data())
    })
}
</script>

<template>
    <div class="chat-wrapper">
        <aside class="messenger-aside">
            <div class="header-search-input-wrapper header-search-input-wrapper--messenger">
                <span class="pi pi-arrow-left pi-arrow-left--header" v-on:click="router.go(-1)" />
                <input class="header-search-input" @input="inputSearch" type="text" v-model="inputRef"
                    placeholder="Browse..." />
            </div>
            <nav class="messenger-user-list">

                <div class="messenger-user" v-for="(chat) in allChats" :key="chat?.uid" @click="onChatSelected(chat)"
                    :class="{ 'active-chat': selectedChat?.uid === chat[0] }">

                    <ProfileImage :src="chat[1].images.mainImage" :width="50" :height="50"></ProfileImage>

                    <div class="messenger-user-main">
                        <h4 class="messenger-user-title">{{ chat[1]?.displayName }}</h4>
                        <div class="messenger-user-last-message-about">
                            <p v-if="chat[1].lastMessage?.author?.userID === useAuthStore().authUser?.uid"
                                class="messenger-user-last-message-author"> {{ 'You:' }}</p>
                            <p v-else class="messenger-user-last-message-author"> {{ `${chat[1].lastMessage?.author?.name}:
                                `}}</p>

                            <p v-if="chat[1]?.lastMessage" class="messenger-user-last-message"> {{
                                chat[1]?.lastMessage?.text + '' }}</p>
                        </div>
                    </div>

                </div>
            </nav>
        </aside>

        <div v-if="selectedChat" class="messenger-wrapper">
            <!-- <header class="messenger-header">

                <div class="messenger-header-info">
                    <h1 class="messenger-header-name"> {{ selectedChat?.displayName }}</h1>
                    <span class="messenger-header-status">Last seen recently</span>
                </div>
            </header> -->
            <section class="messenger">

                <div v-for="msg in sortedMessages" :key="msg.id" @click="onReply(msg)">
                    <div v-if="msg?.text?.length" ref="messenger" class='messages' :class="msg?.author?.userID === useAuthStore()?.authUser.uid ? 'messages-auth' : 'messages-guest',
                        reply?.id === msg.id ? 'active-chat' : ''">

                        <div class="message-content">
                            <div v-if="msg?.reply?.text.length" class="messenger-reply messenger-reply-in-message">
                                <div class="messenger-reply-left">


                                    <div class="messenger-reply-content">

                                        <h4 class="messenger-reply-name">
                                            {{ msg.reply.author.name }}
                                        </h4>

                                        <p class="messenger-reply-text">
                                            {{ msg?.reply?.text }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            {{ msg.text }}
                        </div>
                    </div>


                </div>

                <div class="into" ref="messenger" :style="{ height: canScroll ? '10px' : '0' }"></div>
            </section>
            <div v-if="reply?.text" class="messenger-reply">
                <div class="messenger-reply-left">
                    <span class="pi pi-reply"></span>

                    <div class="messenger-reply-content">

                        <h4 class="messenger-reply-name">
                            {{ reply.author.name }}
                        </h4>

                        <p class="messenger-reply-text">
                            {{ reply.text }}
                        </p>
                    </div>
                </div>

                <span class="pi pi-times pi-times-reply" @click="reply = null"></span>
            </div>


            <div class="messenger-form">
                <input class="header-search-input" v-model="text" placeholder="Type your message here" />
                <button class="messenger-button" :disabled="!text" @click.prevent="onMessageSent">
                    <span class="pi pi-send">
                    </span>
                </button>
            </div>
        </div>

    </div>
</template>

<style>
.messenger-aside {
    width: 270px;
    min-height: 100vh;
    border-right: 1px solid rgb(223, 223, 223);
}

.header-search-input-wrapper--messenger {
    display: flex;
    padding: 10px;
    box-shadow: 0 2px 2px rgb(229, 228, 228);
}


.chat-wrapper {
    display: flex;
    width: 100%;
}

.into {
    width: 100%;
}

.messenger-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    flex-direction: column;
    max-height: 100vh;
}

.messenger {
    background-color: rgba(65, 65, 65, 0.027);
    overflow: auto;
    flex-grow: 1;
    padding: 20px 0;
    height: 100vh;
}

.messenger-header {
    display: flex;
    padding: 0 20px;
    left: 230px;
    right: 0;
    backdrop-filter: blur(12px);
    position: fixed;
    box-shadow: 0 2px 2px rgb(229, 228, 228);
}

.messenger-header-info {
    display: flex;
    flex-direction: column;
    padding: 2px 10px;
    justify-content: center;
}

.messenger-header-name {
    margin: 0;
    padding: 0;
    font-size: 22px;
}

.messenger-header-status {
    color: rgba(128, 128, 128, 0.656);
    font-size: 14px;
    padding: 2px 2px;
}

.messenger-user-list {
    padding-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.messenger-user {
    display: flex;
    align-items: center;
    padding: 4px 6px;
}

.messenger-user-main {
    display: flex;
    flex-direction: column;
    padding: 4px;
    cursor: pointer;
}

.messenger-user-main {}

.messenger-user-last-message-about {
    display: flex;
    color: grey;
    padding: 4px 2px;
    font-size: 14px;
    gap: 4px;
}

.messenger-user-last-message {
    font-style: italic;
}

.messenger-reply {
    display: flex;
    padding: 4px;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.messenger-reply-in-message {
    background-color: transparent;
    color: white;
    border-left: 2px solid white;
    padding: 4px;
}

.messenger-reply-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.messenger-reply-content {
    display: flex;
    flex-direction: column;
}

.messenger-reply-name {
    color: rgb(140, 140, 236);
}

.pi-reply {
    color: rgb(140, 140, 236);
    font-weight: bold;
    padding: 4px;
}

.pi-times-reply {
    color: grey;
    padding: 4px;
    font-size: 12px;
}

.messenger-reply-text {
    color: rgb(206, 206, 206);
}


/** **/
.messages {
    display: flex;
    padding: 20px 10px;
    cursor: pointer;
}

.messages-guest {
    justify-content: flex-start;
    padding: 4px 4px;
}

.messages-auth {
    justify-content: end;
    padding: 4px 4px;
}

.message-content {
    padding: 10px 30px;
    max-width: 66%;
    box-shadow: 0 2px 2px #28282835;
}


.messages-guest .message-content {
    color: white;
    background-color: rgb(92, 90, 90);
    border-radius: 2px 24px 24px 24px;
}

.messages-auth .message-content {
    border-radius: 24px 24px 2px 24px;
    background-color: rgba(47, 48, 133, 0.368);
}


.messenger-form {
    position: relative;
    width: 100%;
    display: flex;
    padding: 4px 20px;
    justify-content: center;
    align-items: center;
    box-shadow: 0 -2px 2px rgb(229, 228, 228);
}

.messages-input-label {
    display: flex;
    justify-content: center;
    align-items: center;
}

.messages-form-input {
    width: 100%;
    padding: 4px;
}

.messenger-button {
    background-color: transparent;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    right: 0;
    transform: translateX(-50%);
    border: none;
    padding: 10px;
    font-size: 24px;
    color: grey;
    background-color: #8f8f8f17;
    border-radius: 50%;
}

.messenger-button span:hover {
    color: rgba(51, 51, 221, 0.649);
    cursor: pointer;
}

.active-chat {
    background-color: rgb(229, 228, 228);
}
</style>