// Package engine implements the Large Data Model (LDM) Combat Simulator,
// Archetype Registry, Gambit/DSL Command Loaders, 11-Vector Clash Calculator,
// and Concurrent Worker-Pool Monte Carlo Simulator in idiomatic Go.
package engine

import (
	"bufio"
	"encoding/json"
	"fmt"
	"math"
	"math/rand"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

// Pi314 is the canonical 3.14 Pi Principle constant.
const Pi314 = 3.14

// ArchetypeCatalog represents data/archetypes.json.
type ArchetypeCatalog struct {
	SchemaVersion string      `json:"schema_version"`
	ModelType     string      `json:"model_type"`
	Archetypes    []Archetype `json:"archetypes"`
}

// Archetype defines an ECAT archetype entry.
type Archetype struct {
	ID                     string             `json:"id"`
	Name                   string             `json:"name"`
	ClassRole              string             `json:"class_role"`
	ArmorType              string             `json:"armor_type"`
	CorrectedPolicyEnabled bool               `json:"corrected_policy_enabled"`
	BaseAttributes         map[string]float64 `json:"base_attributes"`
	DefaultCommands        []string           `json:"default_commands"`
	SubArchetypes          []SubArchetype     `json:"sub_archetypes"`
}

// SubArchetype defines stat multiplier overrides.
type SubArchetype struct {
	ID              string             `json:"id"`
	Name            string             `json:"name"`
	StatMultipliers map[string]float64 `json:"stat_multipliers"`
}

// Profiles314Catalog represents data/profiles_314.json.
type Profiles314Catalog struct {
	SchemaVersion     string                `json:"schema_version"`
	ModelType         string                `json:"model_type"`
	PiPrincipleAnchor float64               `json:"pi_principle_anchor"`
	CharacterProfiles []CharacterProfile314 `json:"character_profiles"`
}

// CharacterProfile314 represents a 1-Profile-1-Character 11-Vector record.
type CharacterProfile314 struct {
	ProfileID               string  `json:"profileId"`
	CharacterName           string  `json:"characterName"`
	ArchetypeClass          string  `json:"archetypeClass"`
	MappedCoreArchetype     string  `json:"mappedCoreArchetype"`
	CommandsRuleStack       string  `json:"commandsRuleStack"`
	TacticalFunction        string  `json:"tacticalFunction"`
	SpriteAnimationForm     string  `json:"spriteAnimationForm"`
	StatWeightPi            float64 `json:"statWeightPi"`
	ArmorWeightPi           float64 `json:"armorWeightPi"`
	WeaponWeightPi          float64 `json:"weaponWeightPi"`
	SkillName               string  `json:"skillName"`
	SkillAbilityName        string  `json:"skillAbilityName"`
	VfxType                 string  `json:"vfxType"`
	SkillTone               string  `json:"skillTone"`
	SkillDefense            string  `json:"skillDefense"`
	CanonicalMetricsOfSkill string  `json:"canonicalMetricsOfSkill"`
	BaseHp                  float64 `json:"baseHp"`
	BaseAttack              float64 `json:"baseAttack"`
	BaseDefense             float64 `json:"baseDefense"`
	BaseRangeTiles          int     `json:"baseRangeTiles"`
	MoveSpeedPi             float64 `json:"moveSpeedPi"`
}

// SPCMatrixModel represents data/spc_transition_matrix.json.
type SPCMatrixModel struct {
	StateOrder                   []string      `json:"state_order"`
	PBaseline                    [][]float64   `json:"p_baseline"`
	PCorrected                   [][]float64   `json:"p_corrected"`
	TransformationTensor         [][]float64   `json:"transformation_tensor"`
	PossibilityOverrideThreshold float64       `json:"possibility_override_threshold"`
}

// Clash11VectorResult holds the result of an 11-Vector procedural clash calculation.
type Clash11VectorResult struct {
	AttackerID         string  `json:"attacker_id"`
	DefenderID         string  `json:"defender_id"`
	InitiativeRadPerS  float64 `json:"initiative_rad_per_sec"`
	RawWeightedOffense float64 `json:"raw_weighted_offense"`
	DefenderMitigation float64 `json:"defender_armor_mitigation"`
	NetDamagePerHit    float64 `json:"net_damage_per_hit"`
	TurnsToWin         int     `json:"turns_to_win"`
	WinProbabilityPct  float64 `json:"lanchester_asabiyyah_win_prob_pct"`
	ActiveVFX          string  `json:"active_vfx"`
	CommandsStack      string  `json:"commands_stack"`
}

// MonteCarloSummary holds concurrent Monte Carlo convergence statistics.
type MonteCarloSummary struct {
	Matchup          string  `json:"matchup"`
	Iterations       int     `json:"iterations"`
	ArchAWinRate     float64 `json:"arch_a_win_rate"`
	ArchBWinRate     float64 `json:"arch_b_win_rate"`
	AvgTicks         float64 `json:"avg_ticks"`
	AvgSPCTransitions float64 `json:"avg_spc_transitions"`
}

// DataStore holds all loaded Large Data Models in memory.
type DataStore struct {
	Archetypes  map[string]Archetype
	Profiles314 map[string]CharacterProfile314
	SPC         SPCMatrixModel
}

// LoadDataStore loads all JSON Large Data Models from dataDir.
func LoadDataStore(dataDir string) (*DataStore, error) {
	ds := &DataStore{
		Archetypes:  make(map[string]Archetype),
		Profiles314: make(map[string]CharacterProfile314),
	}

	archBytes, err := os.ReadFile(filepath.Join(dataDir, "archetypes.json"))
	if err != nil {
		return nil, fmt.Errorf("reading archetypes.json: %w", err)
	}
	var archCat ArchetypeCatalog
	if err := json.Unmarshal(archBytes, &archCat); err != nil {
		return nil, fmt.Errorf("parsing archetypes.json: %w", err)
	}
	for _, a := range archCat.Archetypes {
		ds.Archetypes[a.ID] = a
	}

	profBytes, err := os.ReadFile(filepath.Join(dataDir, "profiles_314.json"))
	if err != nil {
		return nil, fmt.Errorf("reading profiles_314.json: %w", err)
	}
	var profCat Profiles314Catalog
	if err := json.Unmarshal(profBytes, &profCat); err != nil {
		return nil, fmt.Errorf("parsing profiles_314.json: %w", err)
	}
	for _, p := range profCat.CharacterProfiles {
		ds.Profiles314[p.ProfileID] = p
	}

	spcBytes, err := os.ReadFile(filepath.Join(dataDir, "spc_transition_matrix.json"))
	if err != nil {
		return nil, fmt.Errorf("reading spc_transition_matrix.json: %w", err)
	}
	if err := json.Unmarshal(spcBytes, &ds.SPC); err != nil {
		return nil, fmt.Errorf("parsing spc_transition_matrix.json: %w", err)
	}

	return ds, nil
}

// ParseGambitVerbs extracts the ordered sequence of command verbs from a Gambit rule stack.
func ParseGambitVerbs(ruleStack string) []string {
	parts := strings.Split(ruleStack, "->")
	verbs := make([]string, 0, len(parts))
	for _, p := range parts {
		trimmed := strings.TrimSpace(p)
		if trimmed == "" {
			continue
		}
		if idx := strings.IndexByte(trimmed, '('); idx > 0 {
			verbs = append(verbs, strings.TrimSpace(trimmed[:idx]))
		} else {
			verbs = append(verbs, trimmed)
		}
	}
	return verbs
}

// ParseDSLScriptFile parses a .cmd DSL batch file and returns non-comment instruction lines.
func ParseDSLScriptFile(path string) ([]string, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, fmt.Errorf("opening DSL script %s: %w", path, err)
	}
	defer f.Close()

	var lines []string
	sc := bufio.NewScanner(f)
	for sc.Scan() {
		line := strings.TrimSpace(sc.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		lines = append(lines, line)
	}
	return lines, sc.Err()
}

// Calculate11VectorClash computes the 11-Vector procedural clash outcome between two profiles.
func (ds *DataStore) Calculate11VectorClash(attID, defID string, statPi, weaponPi, armorPi, empowerPi float64) (Clash11VectorResult, error) {
	att, ok := ds.Profiles314[attID]
	if !ok {
		return Clash11VectorResult{}, fmt.Errorf("unknown attacker profile: %s", attID)
	}
	def, ok := ds.Profiles314[defID]
	if !ok {
		return Clash11VectorResult{}, fmt.Errorf("unknown defender profile: %s", defID)
	}

	if statPi <= 0 {
		statPi = att.StatWeightPi
	}
	if weaponPi <= 0 {
		weaponPi = att.WeaponWeightPi
	}
	if armorPi <= 0 {
		armorPi = def.ArmorWeightPi
	}
	if empowerPi <= 0 {
		empowerPi = Pi314
	}

	denom := math.Max(0.5, weaponPi*0.314)
	initiative := math.Round(((att.MoveSpeedPi*statPi)/denom)*100) / 100
	rawOffense := att.BaseAttack * (statPi / Pi314) * (1.0 + weaponPi/6.28) * (empowerPi / Pi314)
	mitigation := def.BaseDefense * (armorPi / Pi314) * 0.628
	netDamage := math.Max(31.4, rawOffense-mitigation)
	turns := int(math.Ceil(def.BaseHp / netDamage))
	winProb := math.Min(99.6, math.Max(52.0, 68.0+(rawOffense-mitigation)*0.085))

	return Clash11VectorResult{
		AttackerID:         att.ProfileID,
		DefenderID:         def.ProfileID,
		InitiativeRadPerS:  initiative,
		RawWeightedOffense: math.Round(rawOffense*100) / 100,
		DefenderMitigation: math.Round(mitigation*100) / 100,
		NetDamagePerHit:    math.Round(netDamage*100) / 100,
		TurnsToWin:         turns,
		WinProbabilityPct:  math.Round(winProb*100) / 100,
		ActiveVFX:          att.VfxType,
		CommandsStack:      att.CommandsRuleStack,
	}, nil
}

// RunConcurrentMonteCarlo executes a worker-pool Monte Carlo simulation between two archetypes.
func (ds *DataStore) RunConcurrentMonteCarlo(archAID, archBID string, iterations int, workers int) (MonteCarloSummary, error) {
	archA, ok := ds.Archetypes[archAID]
	if !ok {
		return MonteCarloSummary{}, fmt.Errorf("unknown archetype: %s", archAID)
	}
	archB, ok := ds.Archetypes[archBID]
	if !ok {
		return MonteCarloSummary{}, fmt.Errorf("unknown archetype: %s", archBID)
	}

	if workers <= 0 {
		workers = 4
	}
	jobs := make(chan int, iterations)
	for i := 0; i < iterations; i++ {
		jobs <- i
	}
	close(jobs)

	type trialResult struct {
		aWon           bool
		ticks          int
		spcTransitions int
	}
	results := make(chan trialResult, iterations)

	var wg sync.WaitGroup
	for w := 0; w < workers; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for idx := range jobs {
				rng := rand.New(rand.NewSource(int64(314159 + idx*314)))
				hpA := archA.BaseAttributes["max_hp"]
				hpB := archB.BaseAttributes["max_hp"]
				atkA := archA.BaseAttributes["attack_power"] + archA.BaseAttributes["spell_power"]*0.75
				atkB := archB.BaseAttributes["attack_power"] + archB.BaseAttributes["spell_power"]*0.75
				defA := (archA.BaseAttributes["armor"] + archA.BaseAttributes["magic_resist"]) * 0.5
				defB := (archB.BaseAttributes["armor"] + archB.BaseAttributes["magic_resist"]) * 0.5
				critA := archA.BaseAttributes["crit_chance"]
				critB := archB.BaseAttributes["crit_chance"]

				stateA, stateB := 0, 0
				spcTrans := 0
				ticks := 0

				for ticks < 60 && hpA > 0 && hpB > 0 {
					ticks++
					// Step SPC state using PCorrected
					nextA := sampleMarkovState(rng, ds.SPC.PCorrected[stateA])
					if nextA == 3 && hpA > archA.BaseAttributes["max_hp"]*0.18 {
						nextA = 2
					}
					if nextA != stateA {
						spcTrans++
						stateA = nextA
					}

					nextB := sampleMarkovState(rng, ds.SPC.PCorrected[stateB])
					if nextB == 3 && hpB > archB.BaseAttributes["max_hp"]*0.18 {
						nextB = 2
					}
					if nextB != stateB {
						spcTrans++
						stateB = nextB
					}

					// Damage A -> B
					multA := 1.0
					if rng.Float64() < critA {
						multA = archA.BaseAttributes["crit_multiplier"]
					}
					dmgA := math.Max(25.0, (atkA*1.35*multA)*(110.0/(110.0+defB*(1.0-archA.BaseAttributes["armor_penetration"]))))
					hpB -= dmgA
					if hpB <= 0 {
						break
					}

					// Damage B -> A
					multB := 1.0
					if rng.Float64() < critB {
						multB = archB.BaseAttributes["crit_multiplier"]
					}
					dmgB := math.Max(25.0, (atkB*1.35*multB)*(110.0/(110.0+defA*(1.0-archB.BaseAttributes["armor_penetration"]))))
					hpA -= dmgB
				}

				results <- trialResult{
					aWon:           hpA >= hpB,
					ticks:          ticks,
					spcTransitions: spcTrans,
				}
			}
		}()
	}

	wg.Wait()
	close(results)

	winsA := 0
	totalTicks := 0
	totalSPC := 0
	for r := range results {
		if r.aWon {
			winsA++
		}
		totalTicks += r.ticks
		totalSPC += r.spcTransitions
	}

	winRateA := math.Round((float64(winsA)/float64(iterations))*10000) / 10000
	return MonteCarloSummary{
		Matchup:           fmt.Sprintf("%s vs %s", archAID, archBID),
		Iterations:        iterations,
		ArchAWinRate:      winRateA,
		ArchBWinRate:      math.Round((1.0-winRateA)*10000) / 10000,
		AvgTicks:          math.Round((float64(totalTicks)/float64(iterations))*100) / 100,
		AvgSPCTransitions: math.Round((float64(totalSPC)/float64(iterations))*100) / 100,
	}, nil
}

func sampleMarkovState(rng *rand.Rand, probs []float64) int {
	r := rng.Float64()
	cum := 0.0
	for idx, p := range probs {
		cum += p
		if r <= cum {
			return idx
		}
	}
	return len(probs) - 1
}
