
<script setup>


</script>

<template>
    <button type="button">
        <slot></slot>
    </button>
</template>



<style>
.btn {
    border: none;
    padding: 10px 40px;
    color: white;
    font-weight: bold;
    border-radius: 20px;
    opacity: 0.7;
    cursor: pointer;
    transition: opacity 0.1s ease-in;
}

.btn:hover {
    opacity: 1;
}

.btn--submit {
  align-self: flex-end;
  background-color: #000000;
}

.btn--signout {
    background-color: brown;
}

.btn--message {
    background-color: blue;
}

.btn--follow {
    background-color: rgb(248, 248, 248);
    border: 2px solid rgba(57, 57, 227, 0.741);
    color: rgba(0, 0, 0, 0.789);
}



.btn--post {
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: rgb(248, 248, 248);
    border: 2px solid rgba(8, 8, 8, 0.741);
    color: rgba(0, 0, 0, 0.789);
    align-self: flex-end;
}
</style>