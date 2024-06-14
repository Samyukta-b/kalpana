import speech_recognition as sr
import cv2
import matplotlib.pyplot as plt
from io import BytesIO

def audio_to_text():
    recognizer = sr.Recognizer()
    with sr.Microphone(device_index=None) as source:  # Use the default system audio input device
        print("Please speak: ")
        audio = recognizer.listen(source)

    try:
        text = recognizer.recognize_google(audio)
        print("You said:", text)
        return text.upper() 
    except Exception as e:
        print("Error:", str(e))
        return None

def load_images():
    images = {}
    for char in 'ABCDEFGHIJKLMNOPQRSTUVWXYZ': 
        image_path = f"sign_language_images/{char}1.jpg"
        try:
            image = cv2.imread(image_path)
            if image is not None:
                images[char] = image
        except Exception as e:
            print(f"Error loading image for character '{char}': {str(e)}")
    return images

def main():
    images = load_images()
    if not images:
        print("Error loading images.")
        return

    text = audio_to_text()
    if text:
        print("Audio to text conversion successful.")

        #plt.figure(figsize=(10, 6))
        fig, axes = plt.subplots(1, len(text), figsize=(10, 6))

        for i, char in enumerate(text):
            if char in images:
                '''plt.subplot(1, len(text), i + 1)
                plt.imshow(cv2.cvtColor(images[char], cv2.COLOR_BGR2RGB))
                plt.title(char)
                plt.axis('off')'''
                axes[i].imshow(cv2.cvtColor(images[char], cv2.COLOR_BGR2RGB))
                axes[i].set_title(char)
                axes[i].axis('off')
            else:
                print(f"Image not found for character: {char}1.jpg")  # Handle if image not found
        plt.tight_layout()

        buf = BytesIO()
        plt.savefig(buf, format='png')
        buf.seek(0)
        buf_str = buf.getvalue()

        with open('sign_language_output.png', 'wb') as f:
            f.write(buf_str)
        plt.show()

if __name__ == "__main__":
    main()
