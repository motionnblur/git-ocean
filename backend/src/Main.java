import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class Main {
    public static void main(String[] args) {
        //Git git = new Git();
        //git.dropLastCommit();

        int port = 65432;

        try (ServerSocket serverSocket = new ServerSocket(port, 50, InetAddress.getByName("127.0.0.1"))) {
            // Bind only to localhost (127.0.0.1) for local-only access
            System.out.println("Server listening on 127.0.0.1:" + port);

            while (true) { // Keep listening for new clients indefinitely
                // Accept waits for a client connection (blocking call)
                // Try-with-resources ensures the client Socket is closed automatically
                try (Socket clientSocket = serverSocket.accept()) {
                    System.out.println("Client connected: " + clientSocket.getInetAddress().getHostAddress());

                    // Set up streams for communication (using try-with-resources for auto-closing)
                    try (
                            InputStreamReader isr = new InputStreamReader(clientSocket.getInputStream(), "UTF-8");
                            BufferedReader reader = new BufferedReader(isr);
                            PrintWriter writer = new PrintWriter(clientSocket.getOutputStream(), true) // true = autoFlush
                    ) {
                        String line;
                        // Read lines until the client disconnects (readLine returns null)
                        while ((line = reader.readLine()) != null) {
                            System.out.println("Received from client: " + line);

                            // Process the message (simple example: add a prefix)
                            String response = "Java processed: " + line;

                            // Send the response back to the client (println adds newline)
                            writer.println(response);
                            System.out.println("Sent response: " + response);
                        }
                    } catch (IOException e) {
                        System.err.println("Communication error with client: " + e.getMessage());
                    } finally {
                        System.out.println("Client disconnected: " + clientSocket.getInetAddress().getHostAddress());
                    }

                } catch (IOException e) {
                    System.err.println("Error accepting client connection: " + e.getMessage());
                    // Decide if you want to break the loop on accept error,
                    // for this example, we'll just log it and continue listening.
                }
            } // End of while(true) loop

        } catch (IOException e) {
            System.err.println("Could not listen on port " + port + ": " + e.getMessage());
            System.exit(1); // Exit if the server socket cannot be created
        } catch (SecurityException e) {
            System.err.println("Security exception preventing listening on port " + port + ": " + e.getMessage());
            System.exit(1);
        }
    }
}