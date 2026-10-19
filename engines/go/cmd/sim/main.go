// Command sim runs the Go Concurrent Large Data Model Combat Simulator CLI.
package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"os"
	"path/filepath"

	"github.com/randomcase/combat-simulator/engines/go/internal/engine"
)

func main() {
	dataDir := flag.String("data", filepath.Join("data"), "Path to Large Data Models directory")
	iterations := flag.Int("iterations", 500, "Monte Carlo iterations per matchup")
	workers := flag.Int("workers", 8, "Concurrent goroutine workers")
	flag.Parse()

	ds, err := engine.LoadDataStore(*dataDir)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error loading data store: %v\n", err)
		os.Exit(1)
	}

	clash, err := ds.Calculate11VectorClash(
		"CHAR-001-GOOD-WARLOCK",
		"CHAR-011-SYNDICATION-SORCERER",
		9.42, 3.14, 1.57, 3.14,
	)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error computing 11-vector clash: %v\n", err)
		os.Exit(1)
	}

	mc, err := ds.RunConcurrentMonteCarlo("ARCH_SENTINEL", "ARCH_BERSERKER", *iterations, *workers)
	if err != nil {
		fmt.Fprintf(os.Stderr, "error running concurrent Monte Carlo: %v\n", err)
		os.Exit(1)
	}

	dslLines, _ := engine.ParseDSLScriptFile(filepath.Join(*dataDir, "scenarios", "gauntlet_batch.cmd"))

	report := map[string]any{
		"engine":                "Go 1.26 Concurrent LDM Combat Simulator",
		"archetypes_loaded":     len(ds.Archetypes),
		"profiles_314_loaded":   len(ds.Profiles314),
		"dsl_instructions_read": len(dslLines),
		"clash_11vector":        clash,
		"monte_carlo_summary":   mc,
	}

	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	_ = enc.Encode(report)
}
