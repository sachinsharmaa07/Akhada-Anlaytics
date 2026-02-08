/* ──────────────────────────────────────────────────
   Exercise → Image mapping
   Maps each exercise name → its illustration from src/excercises/
   ────────────────────────────────────────────────── */

const EXERCISE_IMAGES = {
  // ── CHEST ──
  'Bench Press':          require('../excercises/barbell_bench_press_-_nb_1295_1.jpg'),
  'Incline Bench Press':  require('../excercises/schrägbankdrücken_lh_538_1.png'),
  'Decline Bench Press':  require('../excercises/press_de_banca_declinado_con_barra_185_1.png'),
  'Dumbbell Press':       require('../excercises/supino_com_halteres_75_1.png'),
  'Incline Dumbbell Press': require('../excercises/incline_dumbbell_bench_press_1276_1.png'),
  'Dumbbell Flyes':       require('../excercises/fly_with_dumbbells_238_1.png'),
  'Cable Crossover':      require('../excercises/kabelcross_323_1.png'),
  'Push Ups':             require('../excercises/push-up_1551_1.png'),
  'Chest Dips':           require('../excercises/fondos_entre_bancos_197_1.png'),
  'Pec Deck':             require('../excercises/butterfly_135_1.png'),

  // ── BACK ──
  'Pull Ups':             require('../excercises/pull-ups__wide_grip__1765_1.png'),
  'Chin Ups':             require('../excercises/trazioni_con_presa_prona_154_1.png'),
  'Lat Pulldown':         require('../excercises/jalón_cerrado_1126_1.png'),
  'Bent Over Row':        require('../excercises/rudern_vorgebeugt_lh_83_1.png'),
  'Deadlift':             require('../excercises/stacco_184_1.jpeg'),
  'Seated Cable Row':     require('../excercises/seated_cable_row_1117_1.png'),
  'T-Bar Row':            require('../excercises/t-bar_rudern__breit__513_1.png'),
  'Single Arm Dumbbell Row': require('../excercises/single_arm_row_1637_1.png'),
  'Face Pull':            require('../excercises/face_pulls_with_yellow_green_band_1732_1.jpg'),
  'Rack Pull':            require('../excercises/rack_deadlift_484_1.png'),

  // ── SHOULDERS ──
  'Overhead Press':       require('../excercises/shoulder_press__barbell_566_1.png'),
  'Dumbbell Shoulder Press': require('../excercises/shoulder_press__dumbbells_567_1.png'),
  'Arnold Press':         require('../excercises/shoulder_press__dumbbell__1337_1.webp'),
  'Lateral Raise':        require('../excercises/seitheben_kh_348_1.png'),
  'Front Raise':          require('../excercises/frontheben_am_kabel_256_1.png'),
  'Rear Delt Fly':        require('../excercises/rear_delt_raise_829_1.png'),
  'Upright Row':          require('../excercises/upright_row_w__dumbbells_694_1.png'),
  'Shrugs':               require('../excercises/shrugs__dumbbells_572_1.png'),
  'Cable Lateral Raise':  require('../excercises/seitheben_am_kabel__einarmig_349_1.png'),

  // ── BICEPS ──
  'Bicep Curl':           require('../excercises/curl_per_bicipiti_con_manubrio_92_1.png'),
  'Hammer Curl':          require('../excercises/hummer_curl_con_manubri_272_1.png'),
  'Preacher Curl':        require('../excercises/preacher_curls_465_1.png'),
  'Concentration Curl':   require('../excercises/cable_concentration_curl_1109_1.png'),
  'EZ Bar Curl':          require('../excercises/curl_de_biceps_con_barra_z_94_1.png'),
  'Cable Curl':           require('../excercises/curl_de_bíceps_en_polea_95_1.png'),
  'Barbell Curl':         require('../excercises/rosca_direta_com_barra_reta_91_1.png'),
  'Incline Dumbbell Curl': require('../excercises/curl_bicipiti_alternato_con_manubrio_1192_1.png'),

  // ── TRICEPS ──
  'Tricep Pushdown':      require('../excercises/triceps_pushdown_1185_1.jpg'),
  'Tricep Dips':          require('../excercises/fundos_para_tríceps_194_1.png'),
  'Skull Crushers':       require('../excercises/skullcrusher_sz-bar_246_1.png'),
  'Overhead Tricep Extension': require('../excercises/trizepsdrücken_kh_über_kopf_50_1.png'),
  'Close Grip Bench Press': require('../excercises/press_de_banca_con_agarre_cerrado_76_1.png'),
  'Diamond Push Ups':     require('../excercises/close-grip_press-ups_1086_1.jpg'),
  'Rope Pushdown':        require('../excercises/trizeps_seildrücken_659_1.png'),
  'Tricep Kickback':      require('../excercises/high-cable_cross_tricep_extention_-_nb_1298_1.png'),

  // ── FOREARMS ──
  'Wrist Curl':           require('../excercises/forearm_curls__underhand_grip__1333_1.webp'),
  'Reverse Wrist Curl':   require('../excercises/handgelenkstreckung_51_1.webp'),
  'Reverse Curl':         require('../excercises/curl_de_biceps_con_agarre_prono_1190_1.png'),
  "Farmer's Walk":        require('../excercises/hand_grip_279_1.webp'),

  // ── ABS ──
  'Plank':                require('../excercises/平板支撑_458_1.png'),
  'Crunches':             require('../excercises/negative_crunches_427_1.png'),
  'Leg Raises':           require('../excercises/leg_raises__lying_377_1.png'),
  'Hanging Knee Raise':   require('../excercises/seated_knee_tuck_1106_1.png'),
  'Ab Wheel Rollout':     require('../excercises/bird_dog_1572_1.png'),
  'Sit Ups':              require('../excercises/仰卧起坐_167_1.png'),
  'Cable Crunch':         require('../excercises/weighted_crunch_1648_1.jpg'),

  // ── OBLIQUES ──
  'Russian Twist':        require('../excercises/russian_twist_1193_1.png'),
  'Side Plank':           require('../excercises/side_crunch_576_1.png'),
  'Woodchoppers':         require('../excercises/torso_twist_1377_1.jpg'),
  'Bicycle Crunches':     require('../excercises/incline_crunches_171_1.png'),

  // ── QUADS ──
  'Squat':                require('../excercises/barbell_squat_1805_1.jpg'),
  'Front Squat':          require('../excercises/sentadilla_frontal_257_1.png'),
  'Leg Press':            require('../excercises/leg_press_on_hackenschmidt_machine_375_1.png'),
  'Leg Extension':        require('../excercises/leg_extension_369_1.png'),
  'Lunges':               require('../excercises/zancadas_caminando_con_mancuernas_206_1.png'),
  'Bulgarian Split Squat': require('../excercises/squats_bulgares_haltères_1706_1.jfif'),
  'Hack Squat':           require('../excercises/pendular_hack_1521_1.webp'),
  'Goblet Squat':         require('../excercises/sentadilla_con_disco_203_1.jpeg'),

  // ── HAMSTRINGS ──
  'Romanian Deadlift':    require('../excercises/romanian_deadlift_1750_1.webp'),
  'Leg Curl':             require('../excercises/leg_curl_364_1.png'),
  'Stiff Leg Deadlift':   require('../excercises/dumbbell_romanian_deadlifts_1673_1.png'),
  'Good Mornings':        require('../excercises/good_mornings_268_1.png'),
  'Nordic Curl':          require('../excercises/hamstring-kicks_1387_1.png'),

  // ── GLUTES ──
  'Hip Thrust':           require('../excercises/hip_thrust_avec_haltère_1642_1.webp'),
  'Glute Bridge':         require('../excercises/elevacion_de_cadera_con_mancuernas_1614_1.jpg'),
  'Cable Kickback':       require('../excercises/extensión_de_gluteos_en_polea_1131_1.png'),
  'Step Ups':             require('../excercises/barbell_step_back_lunge_1830_1.jpg'),
  'Sumo Deadlift':        require('../excercises/sumo_kreuzheben_630_1.webp'),

  // ── CALVES ──
  'Standing Calf Raise':  require('../excercises/wadenheben_stehend_622_1.jpeg'),
  'Seated Calf Raise':    require('../excercises/élévation_des_mollets_haltères_assis_1620_1.jpeg'),
  'Donkey Calf Raise':    require('../excercises/wadendrücken_an_beinpresse_146_1.png'),
  'Bodyweight Calf Raise': require('../excercises/double_leg_calf_raise_1243_1.png'),

  // ── CARDIO / FULL BODY ──
  'Running':              require('../excercises/treadmill_cardio_1615_1.jpg'),
  'Burpees':              require('../excercises/devil_s_press_1556_1.png'),
  'Mountain Climbers':    require('../excercises/plank_shoulder_taps_1091_1.jpg'),
  'Jumping Jacks':        require('../excercises/claps_over_the_head_1223_1.webp'),
  'Box Jumps':            require('../excercises/wall_balls_1100_1.jpg'),
};

/**
 * Get the exercise illustration image for a given exercise name.
 * Returns the webpack-resolved image URL or null if no match.
 */
export const getExerciseImage = (name) => {
  if (!name) return null;
  // Exact match
  if (EXERCISE_IMAGES[name]) return EXERCISE_IMAGES[name];
  // Case-insensitive fallback
  const lower = name.toLowerCase();
  const key = Object.keys(EXERCISE_IMAGES).find(k => k.toLowerCase() === lower);
  return key ? EXERCISE_IMAGES[key] : null;
};

export default EXERCISE_IMAGES;
