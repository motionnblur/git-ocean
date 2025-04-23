import tkinter as tk
from tkinter import scrolledtext # For potentially longer messages
import socket
import threading
import queue # For thread-safe communication back to GUI

# --- Configuration ---
SERVER_HOST = '127.0.0.1' # Must match the server's listening address
SERVER_PORT = 65432        # Must match the server's port

class SimpleClientGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("Simple Socket Client")
        self.root.geometry("400x300")

        # Queue for receiving messages from the network thread
        self.response_queue = queue.Queue()

        # --- GUI Elements ---
        self.input_frame = tk.Frame(root)
        self.input_frame.pack(pady=10, padx=10, fill=tk.X)

        self.message_label = tk.Label(self.input_frame, text="Message:")
        self.message_label.pack(side=tk.LEFT, padx=5)

        self.message_entry = tk.Entry(self.input_frame, width=30)
        self.message_entry.pack(side=tk.LEFT, expand=True, fill=tk.X, padx=5)
        self.message_entry.bind("<Return>", self.send_message_event) # Allow sending with Enter key

        self.send_button = tk.Button(self.input_frame, text="Send", command=self.send_message_event)
        self.send_button.pack(side=tk.LEFT, padx=5)

        self.response_label = tk.Label(root, text="Server Response:")
        self.response_label.pack(pady=(0, 5))

        self.response_text = scrolledtext.ScrolledText(root, height=10, width=45, state=tk.DISABLED)
        self.response_text.pack(pady=5, padx=10, expand=True, fill=tk.BOTH)

        self.status_label = tk.Label(root, text="Status: Idle", bd=1, relief=tk.SUNKEN, anchor=tk.W)
        self.status_label.pack(side=tk.BOTTOM, fill=tk.X)

        # Start checking the queue for messages from the network thread
        self.check_queue()

    def update_status(self, message):
        """Updates the status bar safely."""
        self.status_label.config(text=f"Status: {message}")

    def display_response(self, message):
        """Displays messages in the text area safely."""
        self.response_text.config(state=tk.NORMAL)
        self.response_text.insert(tk.END, message + "\n")
        self.response_text.see(tk.END) # Scroll to the end
        self.response_text.config(state=tk.DISABLED)

    def send_message_event(self, event=None): # event=None allows calling without event object
        """Gets message from entry and starts the network thread."""
        message = self.message_entry.get()
        if not message:
            self.update_status("Cannot send empty message.")
            return

        self.update_status(f"Sending: {message[:20]}...")
        # Start the network communication in a separate thread
        # to avoid blocking the GUI
        thread = threading.Thread(target=self.communicate_with_server, args=(message,), daemon=True)
        thread.start()

    def communicate_with_server(self, message):
        """Handles the socket communication in a background thread."""
        try:
            # Create a socket object
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.settimeout(10) # Add a timeout for blocking operations
                try:
                    s.connect((SERVER_HOST, SERVER_PORT))
                    self.response_queue.put(("status", "Connected to server.")) # Update status via queue

                    # Send message (encode to bytes, add newline)
                    s.sendall(message.encode('utf-8') + b'\n')

                    # Receive response (read until newline)
                    response = b""
                    while True:
                        chunk = s.recv(1024) # Read up to 1024 bytes
                        if not chunk:
                             # Server closed connection prematurely or no more data
                             break
                        response += chunk
                        if b'\n' in chunk: # Check if newline received
                            break # Assuming server sends one line response ending with newline

                    decoded_response = response.decode('utf-8').strip() # Decode and remove trailing newline
                    if decoded_response:
                        self.response_queue.put(("response", decoded_response)) # Put response in queue
                        self.response_queue.put(("status", "Received response."))
                    else:
                        self.response_queue.put(("status", "Received empty response or server disconnected."))

                except socket.timeout:
                    self.response_queue.put(("status", "Error: Connection or receive timed out."))
                except socket.error as e:
                    self.response_queue.put(("status", f"Error: Socket error - {e}"))
                except Exception as e:
                    self.response_queue.put(("status", f"Error: An unexpected error occurred - {e}"))

        except Exception as e:
             # This catches errors during socket creation itself
             self.response_queue.put(("status", f"Error: Failed to create socket - {e}"))


    def check_queue(self):
        """Checks the queue for messages from the network thread and updates GUI."""
        try:
            while True:
                msg_type, message = self.response_queue.get_nowait()
                if msg_type == "status":
                    self.update_status(message)
                elif msg_type == "response":
                    self.display_response(message)
                self.root.update_idletasks() # Process GUI updates
        except queue.Empty:
            pass # No messages in the queue
        finally:
            # Schedule the next check
            self.root.after(100, self.check_queue)

# --- Main Application Startup ---
if __name__ == "__main__":
    root = tk.Tk()
    app = SimpleClientGUI(root)
    root.mainloop()
