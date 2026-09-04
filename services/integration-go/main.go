package main

import (
    "encoding/json"
    "log"
    "net/http"
    "time"
)

type HealthResponse struct {
    Service string `json:"service"`
    Status  string `json:"status"`
    Time    string `json:"time"`
}

func health(w http.ResponseWriter, _ *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    _ = json.NewEncoder(w).Encode(HealthResponse{
        Service: "mortgageops-integration-gateway",
        Status:  "ok",
        Time:    time.Now().UTC().Format(time.RFC3339),
    })
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("GET /health", health)

    server := &http.Server{
        Addr:              ":4200",
        Handler:           mux,
        ReadHeaderTimeout: 5 * time.Second,
        WriteTimeout:      10 * time.Second,
        IdleTimeout:       60 * time.Second,
    }

    log.Println("MortgageOps Go integration gateway listening on :4200")
    log.Fatal(server.ListenAndServe())
}
