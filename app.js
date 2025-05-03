const textarea = document.querySelector("#inputText")
const convertBtn = document.querySelector("#convertBtn")
const pauseBtn = document.querySelector("#pauseBtn")
const resumeBtn = document.querySelector("#resumeBtn")
const voiceSelect = document.querySelector("#voiceSelect")
const pitch = document.querySelector("#pitch")
const rate = document.querySelector("#rate")
const pitchValue = document.querySelector("#pitchValue")
const speedValue = document.querySelector("#speedValue")

let voices = []
let isSpeaking = false

function populateVoiceList() {
    voices = speechSynthesis.getVoices()
    voiceSelect.innerHTML = '<option value="">Select Voice</option>'
    voices.forEach((voice, index) => {
        const option = document.createElement("option")
        option.textContent = `${voice.name} (${voice.lang})`
        option.value = index
        voiceSelect.appendChild(option)
    })
}

populateVoiceList()
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoiceList
}

pitch.addEventListener("input", () => {
    pitchValue.textContent = pitch.value
})

rate.addEventListener("input", () => {
    speedValue.textContent = rate.value
})

convertBtn.addEventListener("click", () => {
    const text = textarea.value.trim()
    if (!text) {
        alert("Please enter some text to convert.")
        return
    }

    speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    const selectedVoice = voiceSelect.value
    if (selectedVoice) {
        utterance.voice = voices[selectedVoice]
    }
    utterance.pitch = parseFloat(pitch.value)
    utterance.rate = parseFloat(rate.value)

    utterance.onstart = () => {
        isSpeaking = true
        pauseBtn.disabled = false
        resumeBtn.disabled = true
        convertBtn.disabled = true
    }

    utterance.onend = () => {
        isSpeaking = false
        pauseBtn.disabled = true
        resumeBtn.disabled = true
        convertBtn.disabled = false
    }

    speechSynthesis.speak(utterance)
})

pauseBtn.addEventListener("click", () => {
    if (isSpeaking) {
        speechSynthesis.pause()
        pauseBtn.disabled = true
        resumeBtn.disabled = false
    }
})

resumeBtn.addEventListener("click", () => {
    if (isSpeaking) {
        speechSynthesis.resume()
        pauseBtn.disabled = false
        resumeBtn.disabled = true
    }
})

window.addEventListener("load", () => {
    pauseBtn.disabled = true
    resumeBtn.disabled = true
})