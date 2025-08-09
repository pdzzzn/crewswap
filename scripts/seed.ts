import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const eurowingsRoutes = [
  // German Domestic & Regional
  {
    flightNumber: "EW1100",
    dep: "DUS",
    arr: "PMI",
    depTime: "06:20",
    arrTime: "08:55",
    days: [1, 3, 5, 7],
  },
  {
    flightNumber: "EW402",
    dep: "CGN",
    arr: "BCN",
    depTime: "09:10",
    arrTime: "11:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW758",
    dep: "HAM",
    arr: "LHR",
    depTime: "07:45",
    arrTime: "09:00",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW9464",
    dep: "DUS",
    arr: "MXP",
    depTime: "12:15",
    arrTime: "14:05",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9460",
    dep: "CGN",
    arr: "ARN",
    depTime: "13:40",
    arrTime: "15:55",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW2462",
    dep: "STR",
    arr: "PMI",
    depTime: "15:00",
    arrTime: "17:30",
    days: [6, 7],
  },
  {
    flightNumber: "EW9740",
    dep: "DUS",
    arr: "LIS",
    depTime: "10:10",
    arrTime: "13:00",
    days: [3, 6],
  },
  {
    flightNumber: "EW8852",
    dep: "HAM",
    arr: "SPU",
    depTime: "06:00",
    arrTime: "08:15",
    days: [2, 5, 7],
  },
  {
    flightNumber: "EW9462",
    dep: "CGN",
    arr: "VIE",
    depTime: "14:00",
    arrTime: "16:00",
    days: [1, 4, 6],
  },
  {
    flightNumber: "EW7584",
    dep: "DUS",
    arr: "HER",
    depTime: "16:45",
    arrTime: "20:15",
    days: [5, 6],
  },

  // Additional German Hub Routes
  {
    flightNumber: "EW1101",
    dep: "PMI",
    arr: "DUS",
    depTime: "09:30",
    arrTime: "12:05",
    days: [1, 3, 5, 7],
  },
  {
    flightNumber: "EW403",
    dep: "BCN",
    arr: "CGN",
    depTime: "12:00",
    arrTime: "14:20",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW759",
    dep: "LHR",
    arr: "HAM",
    depTime: "09:30",
    arrTime: "12:45",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW9465",
    dep: "MXP",
    arr: "DUS",
    depTime: "14:45",
    arrTime: "16:35",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9461",
    dep: "ARN",
    arr: "CGN",
    depTime: "16:25",
    arrTime: "18:40",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW2463",
    dep: "PMI",
    arr: "STR",
    depTime: "18:00",
    arrTime: "20:30",
    days: [6, 7],
  },
  {
    flightNumber: "EW9741",
    dep: "LIS",
    arr: "DUS",
    depTime: "13:30",
    arrTime: "16:20",
    days: [3, 6],
  },
  {
    flightNumber: "EW8853",
    dep: "SPU",
    arr: "HAM",
    depTime: "08:45",
    arrTime: "11:00",
    days: [2, 5, 7],
  },
  {
    flightNumber: "EW9463",
    dep: "VIE",
    arr: "CGN",
    depTime: "16:30",
    arrTime: "18:30",
    days: [1, 4, 6],
  },
  {
    flightNumber: "EW7585",
    dep: "HER",
    arr: "DUS",
    depTime: "20:45",
    arrTime: "00:20",
    days: [5, 6],
  },

  // Berlin Routes
  {
    flightNumber: "EW1200",
    dep: "BER",
    arr: "PMI",
    depTime: "06:00",
    arrTime: "08:30",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1201",
    dep: "PMI",
    arr: "BER",
    depTime: "09:00",
    arrTime: "11:30",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1210",
    dep: "BER",
    arr: "BCN",
    depTime: "14:20",
    arrTime: "16:45",
    days: [2, 4, 6, 7],
  },
  {
    flightNumber: "EW1211",
    dep: "BCN",
    arr: "BER",
    depTime: "17:15",
    arrTime: "19:40",
    days: [2, 4, 6, 7],
  },
  {
    flightNumber: "EW1220",
    dep: "BER",
    arr: "VIE",
    depTime: "08:45",
    arrTime: "10:00",
    days: [1, 3, 5, 7],
  },
  {
    flightNumber: "EW1221",
    dep: "VIE",
    arr: "BER",
    depTime: "10:30",
    arrTime: "11:45",
    days: [1, 3, 5, 7],
  },
  {
    flightNumber: "EW1230",
    dep: "BER",
    arr: "ZUR",
    depTime: "07:15",
    arrTime: "08:30",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW1231",
    dep: "ZUR",
    arr: "BER",
    depTime: "09:00",
    arrTime: "10:15",
    days: [1, 2, 3, 4, 5],
  },

  // Munich Routes
  {
    flightNumber: "EW1300",
    dep: "MUC",
    arr: "PMI",
    depTime: "07:30",
    arrTime: "09:45",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1301",
    dep: "PMI",
    arr: "MUC",
    depTime: "10:15",
    arrTime: "12:30",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1310",
    dep: "MUC",
    arr: "FCO",
    depTime: "11:00",
    arrTime: "12:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW1311",
    dep: "FCO",
    arr: "MUC",
    depTime: "13:00",
    arrTime: "14:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW1320",
    dep: "MUC",
    arr: "ATH",
    depTime: "13:15",
    arrTime: "16:30",
    days: [3, 5, 7],
  },
  {
    flightNumber: "EW1321",
    dep: "ATH",
    arr: "MUC",
    depTime: "17:00",
    arrTime: "18:15",
    days: [3, 5, 7],
  },

  // Frankfurt Routes
  {
    flightNumber: "EW1400",
    dep: "FRA",
    arr: "LHR",
    depTime: "06:30",
    arrTime: "07:15",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW1401",
    dep: "LHR",
    arr: "FRA",
    depTime: "07:45",
    arrTime: "10:30",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW1410",
    dep: "FRA",
    arr: "CDG",
    depTime: "08:00",
    arrTime: "09:15",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1411",
    dep: "CDG",
    arr: "FRA",
    depTime: "09:45",
    arrTime: "11:00",
    days: [1, 2, 3, 4, 5, 6, 7],
  },
  {
    flightNumber: "EW1420",
    dep: "FRA",
    arr: "AMS",
    depTime: "09:30",
    arrTime: "10:45",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW1421",
    dep: "AMS",
    arr: "FRA",
    depTime: "11:15",
    arrTime: "12:30",
    days: [1, 2, 3, 4, 5],
  },

  // Southern Europe Routes
  {
    flightNumber: "EW2100",
    dep: "DUS",
    arr: "FCO",
    depTime: "09:15",
    arrTime: "11:15",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW2101",
    dep: "FCO",
    arr: "DUS",
    depTime: "11:45",
    arrTime: "13:45",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW2110",
    dep: "CGN",
    arr: "NAP",
    depTime: "10:00",
    arrTime: "12:15",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW2111",
    dep: "NAP",
    arr: "CGN",
    depTime: "12:45",
    arrTime: "15:00",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW2120",
    dep: "HAM",
    arr: "MAD",
    depTime: "11:30",
    arrTime: "14:15",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW2121",
    dep: "MAD",
    arr: "HAM",
    depTime: "14:45",
    arrTime: "17:30",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW2130",
    dep: "STR",
    arr: "AGP",
    depTime: "12:45",
    arrTime: "15:30",
    days: [3, 6],
  },
  {
    flightNumber: "EW2131",
    dep: "AGP",
    arr: "STR",
    depTime: "16:00",
    arrTime: "18:45",
    days: [3, 6],
  },

  // Mediterranean & Islands
  {
    flightNumber: "EW2200",
    dep: "DUS",
    arr: "IBZ",
    depTime: "08:00",
    arrTime: "10:15",
    days: [5, 6, 7],
  },
  {
    flightNumber: "EW2201",
    dep: "IBZ",
    arr: "DUS",
    depTime: "10:45",
    arrTime: "13:00",
    days: [5, 6, 7],
  },
  {
    flightNumber: "EW2210",
    dep: "CGN",
    arr: "CAG",
    depTime: "13:30",
    arrTime: "15:45",
    days: [4, 7],
  },
  {
    flightNumber: "EW2211",
    dep: "CAG",
    arr: "CGN",
    depTime: "16:15",
    arrTime: "18:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW2220",
    dep: "HAM",
    arr: "CTA",
    depTime: "07:00",
    arrTime: "10:15",
    days: [2, 5],
  },
  {
    flightNumber: "EW2221",
    dep: "CTA",
    arr: "HAM",
    depTime: "10:45",
    arrTime: "14:00",
    days: [2, 5],
  },
  {
    flightNumber: "EW2230",
    dep: "STR",
    arr: "OLB",
    depTime: "14:15",
    arrTime: "16:00",
    days: [6, 7],
  },
  {
    flightNumber: "EW2231",
    dep: "OLB",
    arr: "STR",
    depTime: "16:30",
    arrTime: "18:15",
    days: [6, 7],
  },

  // Eastern Europe
  {
    flightNumber: "EW3100",
    dep: "DUS",
    arr: "PRG",
    depTime: "07:45",
    arrTime: "08:45",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW3101",
    dep: "PRG",
    arr: "DUS",
    depTime: "09:15",
    arrTime: "10:15",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW3110",
    dep: "CGN",
    arr: "WAW",
    depTime: "10:30",
    arrTime: "12:15",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW3111",
    dep: "WAW",
    arr: "CGN",
    depTime: "12:45",
    arrTime: "14:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW3120",
    dep: "HAM",
    arr: "BUD",
    depTime: "09:00",
    arrTime: "11:00",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW3121",
    dep: "BUD",
    arr: "HAM",
    depTime: "11:30",
    arrTime: "13:30",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW3130",
    dep: "STR",
    arr: "KRK",
    depTime: "11:15",
    arrTime: "13:00",
    days: [3, 6],
  },
  {
    flightNumber: "EW3131",
    dep: "KRK",
    arr: "STR",
    depTime: "13:30",
    arrTime: "15:15",
    days: [3, 6],
  },

  // Scandinavian Routes
  {
    flightNumber: "EW3200",
    dep: "DUS",
    arr: "CPH",
    depTime: "08:30",
    arrTime: "09:45",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW3201",
    dep: "CPH",
    arr: "DUS",
    depTime: "10:15",
    arrTime: "11:30",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW3210",
    dep: "CGN",
    arr: "OSL",
    depTime: "09:45",
    arrTime: "11:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW3211",
    dep: "OSL",
    arr: "CGN",
    depTime: "12:00",
    arrTime: "13:45",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW3220",
    dep: "HAM",
    arr: "GOT",
    depTime: "07:30",
    arrTime: "08:45",
    days: [1, 3, 5, 7],
  },
  {
    flightNumber: "EW3221",
    dep: "GOT",
    arr: "HAM",
    depTime: "09:15",
    arrTime: "10:30",
    days: [1, 3, 5, 7],
  },

  // UK & Ireland Routes
  {
    flightNumber: "EW4100",
    dep: "DUS",
    arr: "MAN",
    depTime: "06:45",
    arrTime: "07:30",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW4101",
    dep: "MAN",
    arr: "DUS",
    depTime: "08:00",
    arrTime: "10:45",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW4110",
    dep: "CGN",
    arr: "EDI",
    depTime: "10:15",
    arrTime: "11:00",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW4111",
    dep: "EDI",
    arr: "CGN",
    depTime: "11:30",
    arrTime: "14:15",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW4120",
    dep: "HAM",
    arr: "DUB",
    depTime: "09:00",
    arrTime: "10:30",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW4121",
    dep: "DUB",
    arr: "HAM",
    depTime: "11:00",
    arrTime: "14:30",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW4130",
    dep: "STR",
    arr: "BHX",
    depTime: "08:15",
    arrTime: "09:00",
    days: [3, 6],
  },
  {
    flightNumber: "EW4131",
    dep: "BHX",
    arr: "STR",
    depTime: "09:30",
    arrTime: "12:15",
    days: [3, 6],
  },

  // Greek Islands & Turkey
  {
    flightNumber: "EW4453",
    dep: "STR",
    arr: "SKG",
    depTime: "11:00",
    arrTime: "14:15",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW4454",
    dep: "SKG",
    arr: "STR",
    depTime: "14:45",
    arrTime: "16:00",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW5100",
    dep: "DUS",
    arr: "RHO",
    depTime: "05:30",
    arrTime: "09:45",
    days: [4, 7],
  },
  {
    flightNumber: "EW5101",
    dep: "RHO",
    arr: "DUS",
    depTime: "10:15",
    arrTime: "12:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW5110",
    dep: "CGN",
    arr: "CFU",
    depTime: "06:15",
    arrTime: "09:30",
    days: [5, 6],
  },
  {
    flightNumber: "EW5111",
    dep: "CFU",
    arr: "CGN",
    depTime: "10:00",
    arrTime: "11:15",
    days: [5, 6],
  },
  {
    flightNumber: "EW5120",
    dep: "HAM",
    arr: "AYT",
    depTime: "04:45",
    arrTime: "08:15",
    days: [3, 6],
  },
  {
    flightNumber: "EW5121",
    dep: "AYT",
    arr: "HAM",
    depTime: "08:45",
    arrTime: "10:15",
    days: [3, 6],
  },
  {
    flightNumber: "EW5130",
    dep: "STR",
    arr: "BOJ",
    depTime: "13:00",
    arrTime: "16:00",
    days: [2, 5],
  },
  {
    flightNumber: "EW5131",
    dep: "BOJ",
    arr: "STR",
    depTime: "16:30",
    arrTime: "17:30",
    days: [2, 5],
  },

  // Additional Return Flights
  {
    flightNumber: "EW2370",
    dep: "PMI",
    arr: "CGN",
    depTime: "08:00",
    arrTime: "10:25",
    days: [2, 5, 7],
  },
  {
    flightNumber: "EW5591",
    dep: "VIE",
    arr: "HAM",
    depTime: "17:30",
    arrTime: "19:00",
    days: [1, 4, 6],
  },
  {
    flightNumber: "EW2900",
    dep: "PRG",
    arr: "ARN",
    depTime: "13:00",
    arrTime: "15:45",
    days: [3, 6],
  },

  // Canary Islands
  {
    flightNumber: "EW6100",
    dep: "DUS",
    arr: "LPA",
    depTime: "06:00",
    arrTime: "10:15",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW6101",
    dep: "LPA",
    arr: "DUS",
    depTime: "11:00",
    arrTime: "15:15",
    days: [1, 4, 7],
  },
  {
    flightNumber: "EW6110",
    dep: "CGN",
    arr: "TFS",
    depTime: "07:30",
    arrTime: "11:45",
    days: [2, 5],
  },
  {
    flightNumber: "EW6111",
    dep: "TFS",
    arr: "CGN",
    depTime: "12:30",
    arrTime: "16:45",
    days: [2, 5],
  },
  {
    flightNumber: "EW6120",
    dep: "HAM",
    arr: "ACE",
    depTime: "08:15",
    arrTime: "12:30",
    days: [3, 6],
  },
  {
    flightNumber: "EW6121",
    dep: "ACE",
    arr: "HAM",
    depTime: "13:15",
    arrTime: "17:30",
    days: [3, 6],
  },

  // North Africa
  {
    flightNumber: "EW7100",
    dep: "DUS",
    arr: "CMN",
    depTime: "09:30",
    arrTime: "13:00",
    days: [2, 6],
  },
  {
    flightNumber: "EW7101",
    dep: "CMN",
    arr: "DUS",
    depTime: "13:45",
    arrTime: "17:15",
    days: [2, 6],
  },
  {
    flightNumber: "EW7110",
    dep: "CGN",
    arr: "TUN",
    depTime: "11:15",
    arrTime: "14:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW7111",
    dep: "TUN",
    arr: "CGN",
    depTime: "15:15",
    arrTime: "18:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW7120",
    dep: "HAM",
    arr: "HRG",
    depTime: "03:00",
    arrTime: "08:15",
    days: [1, 5],
  },
  {
    flightNumber: "EW7121",
    dep: "HRG",
    arr: "HAM",
    depTime: "09:00",
    arrTime: "12:15",
    days: [1, 5],
  },

  // Additional European Cities
  {
    flightNumber: "EW8100",
    dep: "DUS",
    arr: "BRU",
    depTime: "07:00",
    arrTime: "08:00",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW8101",
    dep: "BRU",
    arr: "DUS",
    depTime: "08:30",
    arrTime: "09:30",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW8110",
    dep: "CGN",
    arr: "GVA",
    depTime: "09:15",
    arrTime: "10:30",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW8111",
    dep: "GVA",
    arr: "CGN",
    depTime: "11:00",
    arrTime: "12:15",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW8120",
    dep: "HAM",
    arr: "LYS",
    depTime: "10:45",
    arrTime: "12:30",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW8121",
    dep: "LYS",
    arr: "HAM",
    depTime: "13:00",
    arrTime: "14:45",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW8130",
    dep: "STR",
    arr: "NUE",
    depTime: "18:30",
    arrTime: "19:15",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW8131",
    dep: "NUE",
    arr: "STR",
    depTime: "19:45",
    arrTime: "20:30",
    days: [1, 2, 3, 4, 5],
  },

  // Regional German Routes
  {
    flightNumber: "EW9100",
    dep: "DUS",
    arr: "BRE",
    depTime: "16:15",
    arrTime: "17:00",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW9101",
    dep: "BRE",
    arr: "DUS",
    depTime: "17:30",
    arrTime: "18:15",
    days: [1, 2, 3, 4, 5],
  },
  {
    flightNumber: "EW9110",
    dep: "CGN",
    arr: "DRS",
    depTime: "17:45",
    arrTime: "18:45",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9111",
    dep: "DRS",
    arr: "CGN",
    depTime: "19:15",
    arrTime: "20:15",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9120",
    dep: "HAM",
    arr: "LEJ",
    depTime: "19:00",
    arrTime: "19:45",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW9121",
    dep: "LEJ",
    arr: "HAM",
    depTime: "20:15",
    arrTime: "21:00",
    days: [1, 3, 5],
  },

  // Weekend Leisure Routes
  {
    flightNumber: "EW9200",
    dep: "DUS",
    arr: "TLV",
    depTime: "23:30",
    arrTime: "04:45",
    days: [5],
  },
  {
    flightNumber: "EW9201",
    dep: "TLV",
    arr: "DUS",
    depTime: "05:30",
    arrTime: "08:45",
    days: [1],
  },
  {
    flightNumber: "EW9210",
    dep: "CGN",
    arr: "LCA",
    depTime: "22:45",
    arrTime: "03:15",
    days: [6],
  },
  {
    flightNumber: "EW9211",
    dep: "LCA",
    arr: "CGN",
    depTime: "04:00",
    arrTime: "06:30",
    days: [7],
  },
  {
    flightNumber: "EW9220",
    dep: "HAM",
    arr: "SSH",
    depTime: "04:30",
    arrTime: "08:00",
    days: [7],
  },
  {
    flightNumber: "EW9221",
    dep: "SSH",
    arr: "HAM",
    depTime: "08:45",
    arrTime: "10:15",
    days: [7],
  },

  // Early Morning/Late Night Routes
  {
    flightNumber: "EW9300",
    dep: "DUS",
    arr: "STN",
    depTime: "05:00",
    arrTime: "05:45",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9301",
    dep: "STN",
    arr: "DUS",
    depTime: "06:15",
    arrTime: "09:00",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9310",
    dep: "CGN",
    arr: "CIA",
    depTime: "21:15",
    arrTime: "23:15",
    days: [1, 3, 5],
  },
  {
    flightNumber: "EW9311",
    dep: "CIA",
    arr: "CGN",
    depTime: "23:45",
    arrTime: "01:45",
    days: [2, 4, 6],
  },
  {
    flightNumber: "EW9320",
    dep: "HAM",
    arr: "ORY",
    depTime: "22:00",
    arrTime: "23:45",
    days: [7],
  },
  {
    flightNumber: "EW9321",
    dep: "ORY",
    arr: "HAM",
    depTime: "00:15",
    arrTime: "02:00",
    days: [1],
  },

  // Seasonal/Charter-style Routes
  {
    flightNumber: "EW9400",
    dep: "NUE",
    arr: "PMI",
    depTime: "06:30",
    arrTime: "08:45",
    days: [6, 7],
  },
  {
    flightNumber: "EW9401",
    dep: "PMI",
    arr: "NUE",
    depTime: "09:15",
    arrTime: "11:30",
    days: [6, 7],
  },
  {
    flightNumber: "EW9410",
    dep: "PAD",
    arr: "ALC",
    depTime: "07:00",
    arrTime: "09:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW9411",
    dep: "ALC",
    arr: "PAD",
    depTime: "10:00",
    arrTime: "12:30",
    days: [4, 7],
  },
  {
    flightNumber: "EW9420",
    dep: "DTM",
    arr: "FAO",
    depTime: "08:45",
    arrTime: "11:30",
    days: [5, 7],
  },
  {
    flightNumber: "EW9421",
    dep: "FAO",
    arr: "DTM",
    depTime: "12:00",
    arrTime: "14:45",
    days: [5, 7],
  },

  // Additional Hub Connections
  {
    flightNumber: "EW9500",
    dep: "FMM",
    arr: "VLC",
    depTime: "13:30",
    arrTime: "15:15",
    days: [3, 6],
  },
  {
    flightNumber: "EW9501",
    dep: "VLC",
    arr: "FMM",
    depTime: "15:45",
    arrTime: "17:30",
    days: [3, 6],
  },
  {
    flightNumber: "EW9510",
    dep: "KSF",
    arr: "BVA",
    depTime: "14:15",
    arrTime: "15:45",
    days: [2, 5],
  },
  {
    flightNumber: "EW9511",
    dep: "BVA",
    arr: "KSF",
    depTime: "16:15",
    arrTime: "17:45",
    days: [2, 5],
  },
];

// Aircraft rotation helper - creates more realistic flight patterns
function getConnectingFlights(route: any, allRoutes: any[], date: Date): any[] {
  const arrivalAirport = route.arr;
  const minTurnaroundTime = 45; // minutes
  const maxTurnaroundTime = 180; // 3 hours

  const routeArrivalTime = createDate(date, route.arrTime);

  return allRoutes.filter((nextRoute) => {
    if (nextRoute.dep !== arrivalAirport) return false;

    const nextDepartureTime = createDate(date, nextRoute.depTime);
    const timeDiff = nextDepartureTime.getTime() - routeArrivalTime.getTime();

    return (
      timeDiff >= minTurnaroundTime * 60 * 1000 &&
      timeDiff <= maxTurnaroundTime * 60 * 1000
    );
  });
}

// Enhanced duty creation with better aircraft utilization
function createRealisticDuty(
  routes: any[],
  date: Date,
  isDeadheadOnly: boolean = false
) {
  if (routes.length === 0) return null;

  const legs = [];
  let currentRoute = routes[Math.floor(Math.random() * routes.length)];
  let prevArrival: Date | null = null;
  let currentAirport = currentRoute.dep;

  const maxLegs = isDeadheadOnly
    ? 1
    : Math.min(4, Math.floor(Math.random() * 3) + 2);

  for (let i = 0; i < maxLegs; i++) {
    const depTime = createDate(date, currentRoute.depTime);
    const arrTime = createDate(date, currentRoute.arrTime);

    // Handle overnight flights
    if (arrTime < depTime) arrTime.setDate(arrTime.getDate() + 1);

    // Adjust for aircraft turnaround if this isn't the first leg
    // Define the minimum turnaround time in milliseconds for clarity
    const MIN_TURNAROUND_MS = 45 * 60 * 1000;

    const flightDuration = arrTime.getTime() - depTime.getTime();
    // Calculate the adjusted departure time.
    // Add an explicit type annotation (: Date) for clarity and safety.
    const adjustedDep: Date =
      prevArrival &&
      depTime.getTime() < prevArrival.getTime() + MIN_TURNAROUND_MS
        ? new Date(prevArrival.getTime() + MIN_TURNAROUND_MS) // IF true: Calculate the new departure time
        : depTime; // ELSE: Use the original departure time

    // Now this line will work perfectly, because 'adjustedDep' is guaranteed to be a Date object.
    const adjustedArr = new Date(adjustedDep.getTime() + flightDuration);

    const isDeadhead = isDeadheadOnly || Math.random() < 0.2; // 20% chance of deadhead

    legs.push({
      flightNumber: currentRoute.flightNumber,
      departureTime: adjustedDep,
      arrivalTime: adjustedArr,
      departureLocation: currentRoute.dep,
      arrivalLocation: currentRoute.arr,
      isDeadhead,
    });

    prevArrival = adjustedArr;
    currentAirport = currentRoute.arr;

    // Try to find a connecting flight for next leg
    if (i < maxLegs - 1) {
      const weekday = getWeekday(date);
      const connectingFlights = getConnectingFlights(
        currentRoute,
        routes.filter((r) => r.days.includes(weekday)),
        date
      );

      if (connectingFlights.length > 0) {
        currentRoute =
          connectingFlights[
            Math.floor(Math.random() * connectingFlights.length)
          ];
      } else {
        // If no connecting flight found, try any flight from current airport
        const flightsFromAirport = routes.filter(
          (r) => r.dep === currentAirport && r.days.includes(weekday)
        );
        if (flightsFromAirport.length > 0) {
          currentRoute =
            flightsFromAirport[
              Math.floor(Math.random() * flightsFromAirport.length)
            ];
        } else {
          // No more flights possible, end duty here
          break;
        }
      }
    }
  }

  return legs;
}

function createDate(baseDate: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function getWeekday(date: Date): number {
  const day = date.getDay();
  return day === 0 ? 7 : day;
}

function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Enhanced pairing logic for more realistic crew scheduling
function generatePairingCode(): string {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  return (
    Array.from(
      { length: 2 },
      () => letters[Math.floor(Math.random() * letters.length)]
    ).join("") +
    Array.from(
      { length: 3 },
      () => numbers[Math.floor(Math.random() * numbers.length)]
    ).join("")
  );
}

async function main() {
  console.log("🌱 Seeding comprehensive Eurowings flight duties...");

  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("❌ No users found. Add users first.");
    return;
  }

  await prisma.flightLeg.deleteMany();
  await prisma.duty.deleteMany();

  const today = new Date();
  const maxOffset = 45; // Extended to 6+ weeks

  const userDutyDates = new Map<string, Set<string>>();
  const pairingAssignments = new Map<string, string[]>(); // pairing -> userIds

  // Create some multi-day pairings (10% of duties)
  const multiDayPairings = new Set<string>();

  for (let offset = 0; offset < maxOffset; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const weekday = getWeekday(date);
    const eligibleRoutes = eurowingsRoutes.filter((r) =>
      r.days.includes(weekday)
    );

    if (eligibleRoutes.length === 0) continue;

    // Determine how many crews we need today (varies by day of week)
    const isWeekend = weekday === 6 || weekday === 7;
    const isMonday = weekday === 1;
    const isFriday = weekday === 5;

    let baseCrewCount = Math.floor(Math.random() * 6) + 3; // 3-8 base
    if (isWeekend) baseCrewCount += 2; // More weekend flights
    if (isMonday || isFriday) baseCrewCount += 1; // Business travel days

    const maxCrewsToday = Math.min(baseCrewCount, users.length);
    const shuffledUsers = shuffle(users);
    const usersForToday = shuffledUsers.slice(0, maxCrewsToday);

    for (const user of usersForToday) {
      const key = date.toDateString();
      const assignedDates = userDutyDates.get(user.id) || new Set();

      // Skip if user already has duty this day
      if (assignedDates.has(key)) continue;

      // Check for rest requirements (minimum 12 hours between duties)
      const yesterday = new Date(date);
      yesterday.setDate(date.getDate() - 1);
      if (assignedDates.has(yesterday.toDateString())) {
        // 30% chance to skip for rest
        if (Math.random() < 0.3) continue;
      }

      if (!userDutyDates.has(user.id)) userDutyDates.set(user.id, new Set());
      userDutyDates.get(user.id)!.add(key);

      // Determine duty type
      const isDeadheadOnly = Math.random() < 0.12; // 12% deadhead only
      const isLongHaul = Math.random() < 0.08; // 8% long haul (extended duties)
      const isEarlyStart = Math.random() < 0.25; // 25% early starts
      const isLateFinish = Math.random() < 0.2; // 20% late finishes

      // Create duty legs
      let legs = createRealisticDuty(eligibleRoutes, date, isDeadheadOnly);

      if (!legs || legs.length === 0) {
        // Fallback to simple duty creation
        const selectedRoute =
          eligibleRoutes[Math.floor(Math.random() * eligibleRoutes.length)];
        const depTime = createDate(date, selectedRoute.depTime);
        const arrTime = createDate(date, selectedRoute.arrTime);
        if (arrTime < depTime) arrTime.setDate(arrTime.getDate() + 1);

        legs = [
          {
            flightNumber: selectedRoute.flightNumber,
            departureTime: depTime,
            arrivalTime: arrTime,
            departureLocation: selectedRoute.dep,
            arrivalLocation: selectedRoute.arr,
            isDeadhead: isDeadheadOnly,
          },
        ];
      }

      // Adjust timing for early/late preferences
      if (isEarlyStart && legs.length > 0) {
        const adjustment = -Math.random() * 2 * 60 * 60 * 1000; // Up to 2 hours earlier
        legs[0].departureTime = new Date(
          legs[0].departureTime.getTime() + adjustment
        );
        legs[0].arrivalTime = new Date(
          legs[0].arrivalTime.getTime() + adjustment
        );
      }

      if (isLateFinish && legs.length > 0) {
        const lastLeg = legs[legs.length - 1];
        const adjustment = Math.random() * 3 * 60 * 60 * 1000; // Up to 3 hours later
        lastLeg.arrivalTime = new Date(
          lastLeg.arrivalTime.getTime() + adjustment
        );
      }

      // Generate pairing (some duties share pairings)
      let pairing: string | null = null;
      const shouldHavePairing = Math.random() < 0.7; // 70% of duties have pairings

      if (shouldHavePairing) {
        // Check if we can join an existing pairing for today
        const existingPairings = Array.from(pairingAssignments.keys()).filter(
          (p) => pairingAssignments.get(p)!.length < 4
        ); // Max 4 crew per pairing

        if (existingPairings.length > 0 && Math.random() < 0.3) {
          // 30% chance to join existing pairing
          pairing =
            existingPairings[
              Math.floor(Math.random() * existingPairings.length)
            ];
          pairingAssignments.get(pairing)!.push(user.id);
        } else {
          // Create new pairing
          pairing = generatePairingCode();
          pairingAssignments.set(pairing, [user.id]);

          // 10% chance this becomes a multi-day pairing
          if (Math.random() < 0.1) {
            multiDayPairings.add(pairing);
          }
        }
      }

      await prisma.duty.create({
        data: {
          date,
          userId: user.id,
          pairing,
          legs: {
            create: legs,
          },
        },
      });
    }
  }

  // Create some multi-day pairing extensions
  for (const pairing of multiDayPairings) {
    const crewIds = pairingAssignments.get(pairing) || [];
    if (crewIds.length === 0) continue;

    // Extend this pairing for 1-3 additional days
    const extensionDays = Math.floor(Math.random() * 3) + 1;

    for (let ext = 1; ext <= extensionDays; ext++) {
      const extDate = new Date(today);
      extDate.setDate(
        today.getDate() + Math.floor(Math.random() * maxOffset) + ext
      );
      const weekday = getWeekday(extDate);
      const eligibleRoutes = eurowingsRoutes.filter((r) =>
        r.days.includes(weekday)
      );

      if (eligibleRoutes.length === 0) continue;

      for (const userId of crewIds) {
        const key = extDate.toDateString();
        const assignedDates = userDutyDates.get(userId) || new Set();

        if (assignedDates.has(key)) continue; // Skip if already assigned

        assignedDates.add(key);

        const legs = createRealisticDuty(eligibleRoutes, extDate, false);
        if (!legs || legs.length === 0) continue;

        await prisma.duty.create({
          data: {
            date: extDate,
            userId,
            pairing,
            legs: {
              create: legs,
            },
          },
        });
      }
    }
  }

  const totalDuties = await prisma.duty.count();
  const totalLegs = await prisma.flightLeg.count();
  const uniquePairings = new Set(Array.from(pairingAssignments.keys())).size;

  console.log(`✅ Enhanced Eurowings seeding complete!`);
  console.log(`📊 Created ${totalDuties} duties with ${totalLegs} flight legs`);
  console.log(`✈️  Using ${eurowingsRoutes.length} different routes`);
  console.log(`👥 Generated ${uniquePairings} unique pairings`);
  console.log(`🔄 ${multiDayPairings.size} multi-day pairings created`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
