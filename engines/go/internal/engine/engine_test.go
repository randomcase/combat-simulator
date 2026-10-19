package engine

import (
	"math"
	"path/filepath"
	"testing"
)

func TestDataStoreAndSPCInvariants(t *testing.T) {
	dataDir := filepath.Join("..", "..", "..", "..", "data")
	ds, err := LoadDataStore(dataDir)
	if err != nil {
		t.Fatalf("LoadDataStore failed: %v", err)
	}

	if len(ds.Archetypes) != 6 {
		t.Fatalf("expected 6 archetypes, got %d", len(ds.Archetypes))
	}
	if len(ds.Profiles314) != 12 {
		t.Fatalf("expected 12 character profiles, got %d", len(ds.Profiles314))
	}

	// Verify SPC Transformation Tensor conservation: sum_j T_ij == 0
	for i := 0; i < 4; i++ {
		sumT := 0.0
		for j := 0; j < 4; j++ {
			sumT += ds.SPC.TransformationTensor[i][j]
			diff := math.Abs((ds.SPC.PBaseline[i][j] + ds.SPC.TransformationTensor[i][j]) - ds.SPC.PCorrected[i][j])
			if diff > 1e-6 {
				t.Fatalf("PBaseline + T != PCorrected at (%d,%d)", i, j)
			}
		}
		if math.Abs(sumT) > 1e-6 {
			t.Fatalf("row %d of TransformationTensor does not sum to 0: %f", i, sumT)
		}
	}
}

func Test11VectorClashAndMonteCarlo(t *testing.T) {
	dataDir := filepath.Join("..", "..", "..", "..", "data")
	ds, err := LoadDataStore(dataDir)
	if err != nil {
		t.Fatalf("LoadDataStore failed: %v", err)
	}

	clash, err := ds.Calculate11VectorClash("CHAR-001-GOOD-WARLOCK", "CHAR-011-SYNDICATION-SORCERER", 9.42, 3.14, 1.57, 3.14)
	if err != nil {
		t.Fatalf("Calculate11VectorClash failed: %v", err)
	}
	if clash.NetDamagePerHit <= 31.4 {
		t.Fatalf("expected NetDamagePerHit > 31.4, got %f", clash.NetDamagePerHit)
	}

	verbs := ParseGambitVerbs(clash.CommandsStack)
	if len(verbs) != 4 || verbs[0] != "ORBIT" || verbs[3] != "SEAL_QUMQUM" {
		t.Fatalf("unexpected Gambit verbs: %v", verbs)
	}

	mc, err := ds.RunConcurrentMonteCarlo("ARCH_SENTINEL", "ARCH_BERSERKER", 200, 4)
	if err != nil {
		t.Fatalf("RunConcurrentMonteCarlo failed: %v", err)
	}
	if mc.Iterations != 200 || mc.AvgTicks <= 0 {
		t.Fatalf("invalid Monte Carlo summary: %+v", mc)
	}
}
