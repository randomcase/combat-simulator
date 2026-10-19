package com.combatsim;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.SplittableRandom;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Sovereign 3.14 Pi Combat Simulator — Modern Java 21+/26 LTS Engine.
 * Utilizes Records, Sealed Interfaces, Pattern Matching, and Virtual Threads.
 */
public final class Main {

    public static final double PI_314 = 3.14;

    /** Sealed hierarchy for Command Loader instructions. */
    public sealed interface SimCommand permits SpawnCommand, GambitCommand, ThroneDecreeCommand, Clash11VectorCommand, SimBatchCommand {
    }

    public record SpawnCommand(String unitId, String archetypeId, String subArchetypeId, String team, String profileId) implements SimCommand {}
    public record GambitCommand(String unitId, List<String> verbs) implements SimCommand {}
    public record ThroneDecreeCommand(String departmentId, String decreeCode) implements SimCommand {}
    public record Clash11VectorCommand(String attackerProfileId, String defenderProfileId, double statPi, double weaponPi, double armorPi, double empowerPi) implements SimCommand {}
    public record SimBatchCommand(String opType, int iterations) implements SimCommand {}

    /** Record representing a 1-Profile-1-Character 11-Vector LDM entry. */
    public record CharacterProfile314(
            String profileId,
            String characterName,
            String archetypeClass,
            double statWeightPi,
            double armorWeightPi,
            double weaponWeightPi,
            String vfxType,
            double baseHp,
            double baseAttack,
            double baseDefense,
            double moveSpeedPi,
            String commandsRuleStack
    ) {}

    /** Record representing 11-Vector Procedural Clash output. */
    public record Clash11VectorResult(
            String attackerId,
            String defenderId,
            double initiativeRadPerSec,
            double rawWeightedOffense,
            double defenderMitigation,
            double netDamagePerHit,
            int turnsToWin,
            double winProbabilityPct,
            String activeVfx
    ) {}

    /** Record representing Virtual-Thread Monte Carlo output. */
    public record MonteCarloResult(
            String matchup,
            int iterations,
            double archAWinRate,
            double archBWinRate,
            double avgTicks,
            double avgSpcTransitions
    ) {}

    private static final double[][] P_CORRECTED = {
            {0.92, 0.07, 0.01, 0.00},
            {0.42, 0.55, 0.03, 0.00},
            {0.25, 0.50, 0.23, 0.02},
            {0.00, 0.00, 0.00, 1.00}
    };

    private static final double[][] TRANSFORMATION_TENSOR = {
            { 0.07, -0.05, -0.02,  0.00},
            { 0.12,  0.00, -0.12,  0.00},
            { 0.20,  0.40, -0.37, -0.23},
            { 0.00,  0.00,  0.00,  0.00}
    };

    public static void main(String[] args) throws Exception {
        String dataArg = "data";
        if (args.length >= 2 && "--data".equals(args[0])) {
            dataArg = args[1];
        } else if (args.length >= 1 && !args[0].startsWith("--")) {
            dataArg = args[0];
        }
        Path dataDir = Path.of(dataArg);
        Path profilesPath = dataDir.resolve("profiles_314.json");
        Path dslPath = dataDir.resolve("scenarios").resolve("gauntlet_batch.cmd");

        // 1. Verify SPC Transformation Tensor Conservation Invariant (sum_j T_ij == 0)
        for (int i = 0; i < TRANSFORMATION_TENSOR.length; i++) {
            double rowSum = 0.0;
            for (double v : TRANSFORMATION_TENSOR[i]) {
                rowSum += v;
            }
            if (Math.abs(rowSum) > 1e-6) {
                throw new IllegalStateException("SPC Transformation Tensor row " + i + " violates zero-sum conservation: " + rowSum);
            }
        }

        // 2. Parse Character Profiles from profiles_314.json
        String jsonContent = Files.readString(profilesPath, StandardCharsets.UTF_8);
        List<CharacterProfile314> profiles = parseProfiles(jsonContent);

        // 3. Parse DSL Script via Command Loader into Sealed SimCommand hierarchy
        List<SimCommand> commands = parseDslScript(dslPath);
        int spawnCount = 0;
        int gambitCount = 0;
        int decreeCount = 0;
        for (SimCommand cmd : commands) {
            switch (cmd) {
                case SpawnCommand sc -> spawnCount++;
                case GambitCommand gc -> gambitCount++;
                case ThroneDecreeCommand tc -> decreeCount++;
                case Clash11VectorCommand cc -> {}
                case SimBatchCommand bc -> {}
            }
        }

        // 4. Execute 11-Vector Procedural Clash (CHAR-001 vs CHAR-011)
        CharacterProfile314 warlock = profiles.stream()
                .filter(p -> p.profileId().equals("CHAR-001-GOOD-WARLOCK"))
                .findFirst()
                .orElseThrow();
        CharacterProfile314 sorcerer = profiles.stream()
                .filter(p -> p.profileId().equals("CHAR-011-SYNDICATION-SORCERER"))
                .findFirst()
                .orElseThrow();

        Clash11VectorResult clash = calculate11VectorClash(warlock, sorcerer, 9.42, 3.14, 1.57, 3.14);

        // 5. Execute Virtual-Thread Monte Carlo Batch (500 concurrent virtual-thread tasks)
        MonteCarloResult mc = runVirtualThreadMonteCarlo(500);

        System.out.printf(Locale.US, """
                {
                  "engine": "Java %s Virtual-Thread LDM Combat Simulator",
                  "profiles_314_loaded": %d,
                  "dsl_commands_parsed": %d,
                  "spawned_entities": %d,
                  "gambits_bound": %d,
                  "throne_decrees": %d,
                  "clash_11vector": {
                    "attacker_id": "%s",
                    "defender_id": "%s",
                    "initiative_rad_per_sec": %.2f,
                    "raw_weighted_offense": %.2f,
                    "defender_armor_mitigation": %.2f,
                    "net_damage_per_hit": %.2f,
                    "turns_to_win": %d,
                    "lanchester_asabiyyah_win_prob_pct": %.2f,
                    "active_vfx": "%s"
                  },
                  "virtual_thread_monte_carlo": {
                    "matchup": "%s",
                    "iterations": %d,
                    "arch_a_win_rate": %.4f,
                    "arch_b_win_rate": %.4f,
                    "avg_ticks": %.2f,
                    "avg_spc_transitions": %.2f
                  }
                }
                """,
                Runtime.version(),
                profiles.size(),
                commands.size(),
                spawnCount,
                gambitCount,
                decreeCount,
                clash.attackerId(),
                clash.defenderId(),
                clash.initiativeRadPerSec(),
                clash.rawWeightedOffense(),
                clash.defenderMitigation(),
                clash.netDamagePerHit(),
                clash.turnsToWin(),
                clash.winProbabilityPct(),
                clash.activeVfx(),
                mc.matchup(),
                mc.iterations(),
                mc.archAWinRate(),
                mc.archBWinRate(),
                mc.avgTicks(),
                mc.avgSpcTransitions()
        );
    }

    public static Clash11VectorResult calculate11VectorClash(
            CharacterProfile314 att,
            CharacterProfile314 def,
            double statPi,
            double weaponPi,
            double armorPi,
            double empowerPi
    ) {
        double denom = Math.max(0.5, weaponPi * 0.314);
        double initiative = Math.round(((att.moveSpeedPi() * statPi) / denom) * 100.0) / 100.0;
        double rawOffense = att.baseAttack() * (statPi / PI_314) * (1.0 + weaponPi / 6.28) * (empowerPi / PI_314);
        double mitigation = def.baseDefense() * (armorPi / PI_314) * 0.628;
        double netDamage = Math.max(31.4, rawOffense - mitigation);
        int turns = (int) Math.ceil(def.baseHp() / netDamage);
        double winProb = Math.min(99.6, Math.max(52.0, 68.0 + (rawOffense - mitigation) * 0.085));

        return new Clash11VectorResult(
                att.profileId(),
                def.profileId(),
                initiative,
                rawOffense,
                mitigation,
                netDamage,
                turns,
                winProb,
                att.vfxType()
        );
    }

    public static MonteCarloResult runVirtualThreadMonteCarlo(int iterations) throws Exception {
        try (ExecutorService vExec = Executors.newVirtualThreadPerTaskExecutor()) {
            List<Callable<int[]>> tasks = new ArrayList<>(iterations);
            for (int i = 0; i < iterations; i++) {
                final int seedIdx = i;
                tasks.add(() -> {
                    SplittableRandom rng = new SplittableRandom(314159L + seedIdx * 314L);
                    double hpA = 2150.0;
                    double hpB = 1950.0;
                    int stateA = 0;
                    int stateB = 0;
                    int ticks = 0;
                    int spcTrans = 0;

                    while (ticks < 60 && hpA > 0 && hpB > 0) {
                        ticks++;
                        int nextA = sampleMarkov(rng, P_CORRECTED[stateA]);
                        if (nextA == 3 && hpA > 400.0) nextA = 2;
                        if (nextA != stateA) {
                            spcTrans++;
                            stateA = nextA;
                        }

                        int nextB = sampleMarkov(rng, P_CORRECTED[stateB]);
                        if (nextB == 3 && hpB > 350.0) nextB = 2;
                        if (nextB != stateB) {
                            spcTrans++;
                            stateB = nextB;
                        }

                        double multA = rng.nextDouble() < 0.26 ? 1.95 : 1.0;
                        double dmgA = 264.5 * multA * (110.0 / (110.0 + 97.5 * 0.75));
                        hpB -= dmgA;
                        if (hpB <= 0) break;

                        double multB = rng.nextDouble() < 0.28 ? 2.05 : 1.0;
                        double dmgB = 198.0 * multB * (110.0 / (110.0 + 155.0 * 0.68));
                        hpA -= dmgB;
                    }
                    return new int[]{hpA >= hpB ? 1 : 0, ticks, spcTrans};
                });
            }

            List<Future<int[]>> futures = vExec.invokeAll(tasks);
            int winsA = 0;
            int totalTicks = 0;
            int totalSpc = 0;
            for (Future<int[]> f : futures) {
                int[] r = f.get();
                winsA += r[0];
                totalTicks += r[1];
                totalSpc += r[2];
            }

            double winRateA = (double) winsA / iterations;
            return new MonteCarloResult(
                    "ARCH_SENTINEL vs ARCH_BERSERKER",
                    iterations,
                    winRateA,
                    1.0 - winRateA,
                    (double) totalTicks / iterations,
                    (double) totalSpc / iterations
            );
        }
    }

    private static int sampleMarkov(SplittableRandom rng, double[] probs) {
        double r = rng.nextDouble();
        double cum = 0.0;
        for (int i = 0; i < probs.length; i++) {
            cum += probs[i];
            if (r <= cum) return i;
        }
        return probs.length - 1;
    }

    private static List<CharacterProfile314> parseProfiles(String json) {
        List<CharacterProfile314> list = new ArrayList<>();
        Pattern blockPat = Pattern.compile("\\{\\s*\"profileId\"\\s*:\\s*\"([^\"]+)\"[\\s\\S]*?\"moveSpeedPi\"\\s*:\\s*([0-9.]+)\\s*\\}");
        Matcher m = blockPat.matcher(json);
        while (m.find()) {
            String block = m.group(0);
            String id = extractString(block, "profileId");
            String name = extractString(block, "characterName");
            String archClass = extractString(block, "archetypeClass");
            double statPi = extractDouble(block, "statWeightPi");
            double armorPi = extractDouble(block, "armorWeightPi");
            double weaponPi = extractDouble(block, "weaponWeightPi");
            String vfx = extractString(block, "vfxType");
            double hp = extractDouble(block, "baseHp");
            double atk = extractDouble(block, "baseAttack");
            double def = extractDouble(block, "baseDefense");
            double movePi = extractDouble(block, "moveSpeedPi");
            String stack = extractString(block, "commandsRuleStack");
            list.add(new CharacterProfile314(id, name, archClass, statPi, armorPi, weaponPi, vfx, hp, atk, def, movePi, stack));
        }
        return list;
    }

    private static String extractString(String block, String key) {
        Matcher m = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]+)\"").matcher(block);
        return m.find() ? m.group(1) : "";
    }

    private static double extractDouble(String block, String key) {
        Matcher m = Pattern.compile("\"" + key + "\"\\s*:\\s*([0-9.]+)").matcher(block);
        return m.find() ? Double.parseDouble(m.group(1)) : 0.0;
    }

    private static List<SimCommand> parseDslScript(Path path) throws IOException {
        List<SimCommand> out = new ArrayList<>();
        for (String raw : Files.readAllLines(path, StandardCharsets.UTF_8)) {
            String line = raw.trim();
            if (line.isEmpty() || line.startsWith("#")) continue;
            String[] toks = line.split("\\s+");
            String op = toks[0].toUpperCase(Locale.ROOT);
            switch (op) {
                case "SPAWN" -> {
                    if (toks.length >= 6) {
                        out.add(new SpawnCommand(toks[1], toks[2], toks[3], toks[4], toks[5]));
                    }
                }
                case "BIND_GAMBIT" -> {
                    List<String> verbs = new ArrayList<>();
                    for (String part : line.substring(line.indexOf(toks[1]) + toks[1].length()).split("->")) {
                        String p = part.trim();
                        int idx = p.indexOf('(');
                        if (idx > 0) verbs.add(p.substring(0, idx).trim());
                    }
                    out.add(new GambitCommand(toks[1], verbs));
                }
                case "THRONE_DECREE" -> {
                    if (toks.length >= 3) {
                        out.add(new ThroneDecreeCommand(toks[1], toks[2]));
                    }
                }
                case "CLASH_11VECTOR" -> {
                    if (toks.length >= 3) {
                        out.add(new Clash11VectorCommand(toks[1], toks[2], 9.42, 3.14, 1.57, 3.14));
                    }
                }
                default -> out.add(new SimBatchCommand(op, 1));
            }
        }
        return out;
    }
}
