<script setup>

import { onMounted, ref as vueRef } from 'vue';
import { getDatabase, ref, set, onValue, get } from "firebase/database";
import { ref as storageRef, uploadBytes, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase/firebase';
import { useRoute } from 'vue-router';
import { usePostsStore } from '../stores/postStore';
import { useAuthStore } from '../stores/counter';


const post = vueRef('');
const route = useRoute()
const postStore = usePostsStore();
const store = useAuthStore();

const inputDownload = vueRef(null);
const dragOn = vueRef(false);
const uploadData = vueRef([])
const img = vueRef([]);
const downloadURLS = vueRef([]);


const fileUploader = async (src) => {

  // 'images/' + store.authUser.uid + `/${path}
  const imageRef = storageRef(storage, 'postImages/' + store.authUser.uid + `/${src.name}`);
  const uploadTask = uploadBytesResumable(imageRef, src);

  uploadTask.on('state_changed', (snap) => {
  },
    (error) => {
      // Handle unsuccessful uploads
    },
    () => {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        downloadURLS.value.push(downloadURL);
      });
    }
  )
}

const onPostAdded = async () => {
  if (!post.value.length) return;
  const currentTime = Date.now();
  const newPostRef = ref(db, 'users/' + store.authUser.uid + '/messages' + `/message-${currentTime}`);

 

  const splitTextAndContent = (newPost) => {
    const media = newPost.slice(newPost.indexOf('<iframe'));
    const text = newPost.slice(0, newPost.indexOf('<iframe'));

    if (media.includes('<iframe')) {
      return {
        media,
        text
      }
    } else {
      return {
        text: newPost,
      }
    }
  }

  set(newPostRef,
    {
      createdAt: 1,
      content: splitTextAndContent(post.value),
      likes: 0,
      attachments: downloadURLS.value,
      id: currentTime,
      time: new Date(currentTime.toLocaleString()),
      author: {
        uid: store.authUser.uid,
        photoURL: store.authUser.photoURL,
        displayName: store.authUser.displayName,
      }
    }).then(() => {
      uploadData.value = [];
      downloadURLS.value = [];
      post.value = '';

    })
}

onMounted(() => {
})


const onDrop = (e) => {
  downloadURLS.value = [];
  const data = e.dataTransfer.files[0];
  console.log(data.type)
  uploadData.value = uploadData.value.concat(data);
  uploadData.value.forEach(fileUploader);
  console.log(uploadData.value)

  dragOn.value = false;
}

const createSRC = (img) => URL.createObjectURL(img);

const onAttachmentDelete = (img) => {
  let index = '';
  console.log(downloadURLS.value)
  uploadData.value = uploadData
    .value
    .filter((el, i) => {
      if(el.lastModified !== img.lastModified) {
        
        return true;
      } 
      
      index = i;
      return false;
    })

   downloadURLS.value.splice(index, 1)
}
</script>

<template>
  <div class="creation-wrapper">
    
    <form v-if="!dragOn" class="post-creation" @dragstart.prevent="dragOn = true" @dragover.prevent="dragOn = true"
      :class="{
        'file': dragOn,
      }">
      <div class="post-creation-top"></div>
      <textarea v-model="post" class="post-creation-textarea" placeholder="Enter your thought here">

    </textarea>
      
    
    <div class="post-images" v-if="uploadData?.length">
        <div class="post-attachment-wrapper" v-for="img in uploadData" :key="img.name">
          <span class="pi pi-minus pi-attach-minus" @click="onAttachmentDelete(img)"></span>
          <img class="post-attachment" :src="createSRC(img)" width="80" height="80">
        </div>
      </div>
      <button :disabled="uploadData.length !== downloadURLS.length" class="btn btn--edit" @click.prevent="onPostAdded">
        {{ uploadData.length !== downloadURLS.length ? 'Loading...' : 'Post' }}
      </button>
    </form>
  
    <div class="drop-area" v-if="dragOn" @dragstart.prevent="dragOn = true" @dragover.prevent="dragOn = true"
      @dragleave="dragOn = false" @drop.prevent="onDrop">
      Attach your files
    </div>
  </div>
</template>

<style scoped>
.creation-wrapper {
  padding: 20px 40px;
  border-top: 3px solid rgba(178, 178, 178, 0.468);
  border-bottom: 2px solid rgba(178, 178, 178, 0.468);

}

button:disabled {
  pointer-events: none;
  filter: blur(12px);
}

.file {
  background-color: red;
}

.post-images {
  padding: 0 10px;
  display: flex;
  flex-direction: row;
  gap: 14px;
}

.post-attachment {
  border-radius: 4px;
  border: 2px solid rgba(30, 30, 30, 0.126);
}

.pi-attach-minus {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: -10px;
  top: -10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  ;
  border: 1px solid rgba(30, 30, 30, 0.126);
  background-color: var(--base-bcg-color);
  color: rgb(176, 176, 176);
  font-size: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.pi-attach-minus:hover {
  background-color: rgb(250, 250, 250);
}

.post-attachment-wrapper {
  position: relative;
}

.drop-area {
  margin: 20px auto;
  width: 95%;
  height: 200px;
  border: 2px dashed rgba(63, 63, 149, 0.196);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: lightgray;
}

.btn {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  width: 20%;
  padding: 10px 20px;
  background-color: rgb(4, 4, 165);
}

.post-creation {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  gap: 20px;
  margin-bottom: 20px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  border-radius: 4px;
  cursor: pointer;
}

.post-creation-textarea {
  width: 100%;
  resize: none;
  overflow-Y: hidden;
  padding: 20px 40px;
  border: transparent;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
}

.post-creation-textarea:focus {
  outline-width: 0;
  outline-color: rgba(213, 213, 213, 0.487);
  border: 1px solid rgba(213, 213, 213, 0.487);
}

@media(max-width: 640px) {
  .creation-wrapper {
    padding-top: 40px;
  }
  .post-creation {
    width: 100%;
  }
}
</style>
