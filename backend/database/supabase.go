package database

import (
	"log"
	"os"

	supabase "github.com/supabase-community/supabase-go"
)

var SupabaseClient *supabase.Client

// InitSupabase initializes the Supabase client
func InitSupabase() error {
	supabaseURL := os.Getenv("SUPABASE_URL")
	supabaseKey := os.Getenv("SUPABASE_ANON_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		log.Fatal("SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required")
	}

	client, err := supabase.NewClient(supabaseURL, supabaseKey, nil)
	if err != nil {
		return err
	}

	SupabaseClient = client
	log.Println("Supabase client initialized successfully")
	return nil
}

// GetSupabaseClient returns the initialized Supabase client
func GetSupabaseClient() *supabase.Client {
	return SupabaseClient
}
