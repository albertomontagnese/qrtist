import os
import shutil
import time
import qrcode

NUM_OF_QRS = 1000000  # Change this to the desired number of QR codes (e.g., 1000000 for one million)

# Directory to save the QR code images
output_directory = "qr_codes"

# Remove the existing folder (if it exists) and recreate it
if os.path.exists(output_directory):
    shutil.rmtree(output_directory)

os.makedirs(output_directory)

# Generate and save QR codes
total_size = 0  # Total size of the folder
start_time = time.time()

for qr_id in range(1, NUM_OF_QRS + 1):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,  # Adjust box size to control image size and readability
        border=4
    )
    qr.add_data(f"https://www.albertoqrtest.com/QR_{qr_id}")
    qr.make(fit=True)

    qr_image = qr.make_image(fill_color="black", back_color="white")

    # Save the QR code image with a filename corresponding to the QR_ID
    filename = f"qr_codes/QR_{qr_id}.png"
    qr_image.save(filename)

    # Calculate and accumulate the size of each QR code image
    total_size += os.path.getsize(filename)

end_time = time.time()

# Calculate average size of each QR code
average_size = total_size / NUM_OF_QRS

# Print stats to console
print(f"Generated {NUM_OF_QRS} QR codes.")
print(f"Total size of the folder: {total_size / (1024 * 1024):.2f} MB")
print(f"Average size of each QR code: {average_size / (1024):.2f} KB")
print(f"Time taken: {end_time - start_time:.2f} seconds")

# Write stats to a file
stats_file = "qr_stats.txt"
with open(stats_file, "w") as file:
    file.write(f"Generated {NUM_OF_QRS} QR codes.\n")
    file.write(f"Total size of the folder: {total_size / (1024 * 1024):.2f} MB\n")
    file.write(f"Average size of each QR code: {average_size / (1024):.2f} KB\n")
    file.write(f"Time taken: {end_time - start_time:.2f} seconds\n")

print(f"Stats saved to {stats_file}.")
