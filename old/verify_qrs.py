import cv2
import qrcode
from PIL import Image

def read_qr_code(image_path):
    # Load the QR code image
    img = cv2.imread(image_path)

    # Convert the image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Use OpenCV's QRCodeDetector to detect and decode the QR code
    qr_decoder = cv2.QRCodeDetector()
    retval, points, qr_data = qr_decoder(gray)

    if retval:
        # Decode the URL from the QR code
        url = qr_data
        return url
    else:
        return "Failed to decode"

if __name__ == "__main__":
    # Path to the QR code image
    qr_image_path = "qr_codes/QR_20666.png"

    # Read and decode the QR code
    decoded_url = read_qr_code(qr_image_path)

    # Print the decoded URL
    print("Decoded URL:", decoded_url)
