import { icons } from "lakelib";

// https://unicode.org/emoji/charts/full-emoji-list.html
const specialCharacterItems = [
    { value: "😃", text: "Grinning face with big eyes" },
    { value: "😁", text: "Beaming face with smiling eyes" },
    { value: "😂", text: "Face with tears of joy" },
    { value: "😉", text: "Winking face" },
    { value: "😊", text: "Smiling face with smiling eyes" },
    { value: "😍", text: "Smiling face with heart-eyes" },
    { value: "😘", text: "Face blowing a kiss" },
    { value: "😚", text: "Kissing face with closed eyes" },
    { value: "😜", text: "Winking face with tongue" },
    { value: "😏", text: "Smirking face" },
    { value: "😒", text: "Unamused face" },
    { value: "😌", text: "Relieved face" },
    { value: "😔", text: "Pensive face" },
    { value: "😪", text: "Sleepy face" },
    { value: "😷", text: "Face with medical mask" },
    { value: "😵", text: "Face with crossed-out eyes" },
    { value: "😲", text: "Astonished face" },
    { value: "😳", text: "Flushed face" },

    { value: "😨", text: "Fearful face" },
    { value: "😰", text: "Anxious face with sweat" },
    { value: "😢", text: "Crying face" },
    { value: "😭", text: "Loudly crying face" },
    { value: "😱", text: "Face screaming in fear" },
    { value: "😖", text: "Confounded face" },
    { value: "😣", text: "Persevering face" },
    { value: "😓", text: "Downcast face with sweat" },
    { value: "😩", text: "Weary face" },
    { value: "😫", text: "Tired face" },
    { value: "😤", text: "Face with steam from nose" },
    { value: "😡", text: "Enraged face" },
    { value: "😠", text: "Angry face" },
    { value: "👿", text: "Angry face with horns" },
    { value: "💀", text: "Skull" },
    { value: "💩", text: "Pile of poo" },
    { value: "👹", text: "Ogre" },
    { value: "👺", text: "Goblin" },

    { value: "💌", text: "Love letter" },
    { value: "💘", text: "Heart with arrow" },
    { value: "💝", text: "Heart with ribbon" },
    { value: "💖", text: "Sparkling heart" },
    { value: "💓", text: "Beating heart" },
    { value: "💞", text: "Revolving hearts" },
    { value: "💕", text: "Two hearts" },
    { value: "💔", text: "Broken heart" },
    { value: "💛", text: "Yellow heart" },
    { value: "💚", text: "Green heart" },
    { value: "💙", text: "Blue heart" },
    { value: "💜", text: "Purple heart" },
    { value: "💋", text: "Kiss mark" },
    { value: "💯", text: "Hundred points" },
    { value: "💢", text: "Anger symbol" },
    { value: "💥", text: "Collision" },
    { value: "💫", text: "Dizzy" },
    { value: "💦", text: "Sweat droplets" },

    { value: "💨", text: "Dashing away" },
    { value: "💤", text: "ZZZ" },
    { value: "👋", text: "Waving hand" },
    { value: "✋", text: "Raised hand" },
    { value: "👌", text: "OK hand" },
    { value: "✌", text: "Victory hand" },
    { value: "👈", text: "Backhand index pointing left" },
    { value: "👉", text: "Backhand index pointing right" },
    { value: "👆", text: "Backhand index pointing up" },
    { value: "👇", text: "Backhand index pointing down" },
    { value: "☝", text: "Index pointing up" },
    { value: "👍", text: "Thumbs up" },
    { value: "👎", text: "Thumbs down" },
    { value: "✊", text: "Raised fist" },
    { value: "👊", text: "Oncoming fist" },
    { value: "👏", text: "Clapping hands" },
    { value: "🙏", text: "Folded hands" },
    { value: "💪", text: "Flexed biceps" },

    { value: "👶", text: "Baby" },
    { value: "👨", text: "Man" },
    { value: "👩", text: "Woman" },
    { value: "👴", text: "Old man" },
    { value: "👵", text: "Old woman" },
    { value: "🙍", text: "Person frowning" },
    { value: "🙎", text: "Person pouting" },
    { value: "🙅", text: "Person gesturing NO" },
    { value: "🙆", text: "Person gesturing OK" },
    { value: "🙋", text: "Person raising hand" },
    { value: "🙇", text: "Person bowing" },
    { value: "👮", text: "Police officer" },
    { value: "👷", text: "Construction worker" },
    { value: "⬛", text: "Black large square" },
    { value: "⬜", text: "White large square" },
    { value: "⚫", text: "Black circle" },
    { value: "✅", text: "Check mark button" },
    { value: "❌", text: "Cross mark" },

    { value: "$", text: "Dollar" },
    { value: "€", text: "Euro" },
    { value: "£", text: "Pound" },
    { value: "¥", text: "Yuan / Yen" },
    { value: "₩", text: "Won" },
    { value: "₿", text: "Bitcoin" },
    { value: "←", text: "Leftwards" },
    { value: "→", text: "Rightwards" },
    { value: "↑", text: "Upwards" },
    { value: "↓", text: "Downwards" },
    { value: "±", text: "Plus-minus" },
    { value: "÷", text: "Division" },
    { value: "≤", text: "Less-than or equal to" },
    { value: "≥", text: "Greater-than or equal to" },
    { value: "≠", text: "Not equal to" },
    { value: "≈", text: "Almost equal to" },
    { value: "∞", text: "Infinity" },
    { value: "∠", text: "Angle" },
];

export const specialCharacter = {
    name: "specialCharacter",
    type: "dropdown",
    downIcon: icons.get("down"),
    icon: icons.get("specialCharacter"),
    tooltip: "Special character",
    menuType: "character",
    menuItems: specialCharacterItems,
    menuWidth: "270px",
    menuHeight: "180px",
    onSelect: (editor, value) => {
        editor.command.execute("specialCharacter", value);
    },
};
