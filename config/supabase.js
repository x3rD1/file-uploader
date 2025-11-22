// supabase.js
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE;

const supabase = createClient(supabaseUrl, supabaseServiceRole);

module.exports = supabase;
