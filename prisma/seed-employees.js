import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Super Admin ──────────────────────────────────────────────────────────────

const SUPER_ADMIN = {
  name: "Super Admin",
  email: "admin@bprss.com",
  // plaintext: SuperAdminSecretPassword123@
  password: "$2b$10$aHDPLwdh8Hsv/cFXD6.4IOGU/c5M.iujaPMR.Go2/o4YOTmmWI1RC",
  role: "SUPER_ADMIN",
};

// ─── Data karyawan ───────────────────────────────────────────────────────────
// password default (79 karyawan baru): plaintext = "Password123@"
// password PMS (35 karyawan lama)    : hash asli dari PMS, bisa login dengan password lama

const EMPLOYEES = [
  { nik: "000000", name: "TOTO FIANDHY", email: "000000@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: null, role: "KOMISARIS UTAMA", branch: "KANTOR PUSAT" },
  { nik: "900100", name: "YULI MASMARI", email: "yulimasmari@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081361944460", role: "FUNDING", branch: "KANTOR PUSAT" },
  { nik: "900231", name: "AIE SOESAN", email: "900231@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: null, role: "DIREKTUR OPERASIONAL", branch: "KANTOR PUSAT" },
  { nik: "900286", name: "SUPRIYADI", email: "supriyadi.crb72@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082321315590", role: "SPV REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "900292", name: "AGUS HERU SAJUGO", email: "900292@bprss.com", password: "$2b$10$KRzFJ/DdYb6WyRx2sZG4ZuGuA6FJ2NGGRh9Dcgsc61kMI0azjwhq6", phone: null, role: "DIREKTUR UTAMA", branch: "KANTOR PUSAT" },
  { nik: "901625", name: "MUHAMMAD JAMALUDIN", email: "renzaf9@gmail.com", password: "$2b$10$2oyYNmqklfPI5lNRBDymr.EzXStfqyZ6NJOUQCvg26iIYxIAiCaUG", phone: "088808229533", role: "AREA MANAGER", branch: "KANTOR PUSAT" },
  { nik: "901792", name: "BHUGI FAATHIRAWAN", email: "gie.faathir@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082216154299", role: "PE APUPPT, KEPATUHAN, MANAGER RESIKO", branch: "KANTOR PUSAT" },
  { nik: "901931", name: "SUKIRMAN", email: "901931@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085224340081", role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902180", name: "VICKY FIRMAN PERDANA", email: "vickyfirman842@gmail.com", password: "$2b$10$wwa6iUphn/rfws7TAqSOPuM/7iDsGIM1G5u7uEfpHpv9OsyHeFMie", phone: "085224220519", role: "SLO", branch: "KANTOR PUSAT" },
  { nik: "902183", name: "ASIH NANI", email: "asihnani1990@yahoo.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "0811323731990", role: "SPV FUNDING", branch: "KANTOR PUSAT" },
  { nik: "902192", name: "AKHMADI", email: "kentofabii@gmail.com", password: "$2b$10$lgtxEcoBqeTjuNyqQQqO4ua/GP7sJIqKh3oK7mZw/0MNdX.7VpM5m", phone: "08984848636", role: "LOAN OFFICER", branch: "KANTOR PUSAT" },
  { nik: "902198", name: "ALI ZAENI", email: "alizaeni75.az@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082319484809", role: "ASISTEN AM TIMUR", branch: "KANTOR PUSAT" },
  { nik: "902209", name: "EMAWATI", email: "emawatiii@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085290004136", role: "TELLER KAS", branch: "KANTOR KAS SUMBER" },
  { nik: "902216", name: "NENENG PERANIKA", email: "nenengperanika039@gmail.com", password: "$2b$10$Aa1KzxdseH/sxMEh43bs7ej7HvYlPrivsnHedcO5SI92TY92U0/K6", phone: "088802060477", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS KARANGSEMBUNG" },
  { nik: "902227", name: "ABDUL SUKUR", email: "abdulaza033@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081395777237", role: "STAFF SPI", branch: "KANTOR PUSAT" },
  { nik: "902235", name: "DIAN AGUSTIANI", email: "ianagustiani20@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "088802200402", role: "HEAD TELLER", branch: "KANTOR PUSAT" },
  { nik: "902255", name: "ASDI MUSLIHIN", email: "muslihinasdi@gmail.com", password: "$2b$10$48NAhsZEbV55.L6xJZxeOO396sOdVWHzKGTfKa.T5YieSbeKtNwv.", phone: "082317828521", role: "AREA MANAGER", branch: "KANTOR PUSAT" },
  { nik: "902258", name: "SULAEMAN", email: "sulaemanplumbon@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08522364459", role: "SECURITY", branch: "KANTOR PUSAT" },
  { nik: "902259", name: "ELIN SETIAWATI", email: "elinsetiawati99@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081717209004", role: "TELLER PUSAT", branch: "KANTOR PUSAT" },
  { nik: "902260", name: "TINO SISWANTORO", email: "siswantorotino54@gmail.com", password: "$2b$10$yvgsgb7HM3R4yFqnyYcqkugQwmQcGVl.nMzEu3yI1F7NaBQhXWcVu", phone: "081214519545", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS ARJAWINANGUN" },
  { nik: "902261", name: "NINING RAHMAWATI", email: "niningrahmawati619@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082130036577", role: "TELLER KAS", branch: "KANTOR KAS WALED" },
  { nik: "902271", name: "DEDI TARYUDI", email: "naurahkadija123@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082119856505", role: "LOAN OFFICER", branch: "KANTOR KAS SINDANG LAUT" },
  { nik: "902289", name: "TONI PATONI", email: "rivaitoni@gmail.com", password: "$2b$10$Jje8V9wuZfF..YnZBU9hQ.4nS50qij4euYzk.qWbpdN51TpigeThe", phone: "081911402681", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS WALED" },
  { nik: "902290", name: "IRWANTO", email: "antoirwan567@gmail.com", password: "$2b$10$KLA5lviwtSm3Ah20xtH6Jex4lPg5aYAO6wSR/wFPLdxp2ZsTOq.SS", phone: "081316469124", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS PABEDILAN" },
  { nik: "902293", name: "ARIFIN", email: "cherrylfinza715@gmail.com", password: "$2b$10$6.MOQIkgcP/SZr.p5r6g3eLahIWXBW.5jKnlEesflXeI98V.eL.NS", phone: "083120655087", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS BEBER" },
  { nik: "902294", name: "DEDEN SEPTIAJI", email: "dedenseptiajiaja@gmail.com", password: "$2b$10$zqYdPZdy4k8vLVNNhoUAbuXio47YhPqn62B6MU4BsfTLH.RnaerDm", phone: "081977484027", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS TALUN" },
  { nik: "902298", name: "VIRDA IMANIAR KOSASIH", email: "902298@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "0811241115", role: "SPV ADMIN KREDIT & LEGAL", branch: "KANTOR PUSAT" },
  { nik: "902302", name: "NOVI AFRIYANI", email: "novii.afriyanii@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089628373900", role: "STAFF KEPATUHAN", branch: "KANTOR PUSAT" },
  { nik: "902319", name: "HAERONI", email: "haeroni162@gmail.com", password: "$2b$10$nv5LZWxS/6Ypy2zHxODOdu7ohWYtL/CyIsHfLKs4oVXBJe2YZ6o.u", phone: "087729841070", role: "LOAN OFFICER", branch: "KANTOR KAS WALED" },
  { nik: "902325", name: "RETNO INDRIYANI", email: "retnoindriyani1995@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085961947335", role: "ACCOUNTING", branch: "KANTOR PUSAT" },
  { nik: "902327", name: "LINA MARLINA", email: "linamalina704@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085320908804", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS CIWARINGIN" },
  { nik: "902333", name: "YUDA FIRMANSYAH", email: "yudafirmansyah938@gmail.com", password: "$2b$10$6/jr6HUneM1ueSP.aLv4qu.NnSuLX6uNA2is2BiRQu0fcRUD8JgYa", phone: "082112091442", role: "LOAN OFFICER", branch: "KANTOR KAS PABEDILAN" },
  { nik: "902345", name: "SITI MUNAROH", email: "sitimunaroh021@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089678810813", role: "STAFF SPI", branch: "KANTOR PUSAT" },
  { nik: "902347", name: "AGUS MAULUDIN", email: "agoes@gmail.co.id", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089536470509", role: "SECURITY", branch: "KANTOR PUSAT" },
  { nik: "902348", name: "EEP SUKATMI", email: "eepsukatmi24@gmail.com", password: "$2b$10$60Uc0yD7V6ShorrgM2177OeDaAoUPifTn4wdsWlt3ZtbpKtSQUZF6", phone: "085797518650", role: "LOAN OFFICER", branch: "KANTOR KAS CANGKOAK" },
  { nik: "902358", name: "RIMA FITRIYANI", email: "rimafitriyani17@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081292824040", role: "MANAGER OPERASIONAL", branch: "KANTOR PUSAT" },
  { nik: "902365", name: "E.TUBAGUS FREEZA VANHALLIES LOUFETIE", email: "bagus.r1811@gmail.com", password: "$2b$10$ejEqDt2ZnJT1OKLpvpXIwe/VROBTGbH8A413XvscjXwqrh1BYNtBW", phone: "081313302097", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS SINDANG LAUT" },
  { nik: "902369", name: "ABDUL AZIS", email: "abdul25aziz01@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089666469555", role: "DRIVER", branch: "KANTOR PUSAT" },
  { nik: "902370", name: "BAMBANG BUDIARTO", email: "budiartobambang65@gmail.com", password: "$2b$10$uFLpvrl/1MtNyNp7gfChX.tAOyIjDZ2cMR0QIQuzbR5hxGemxPuOy", phone: "082215145272", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS CANGKOAK" },
  { nik: "902372", name: "BAHARUDDIN ZARKASYI AL' QOHHAR", email: "baharuddinzarkasyi88@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082128717765", role: "SPV SPI", branch: "KANTOR PUSAT" },
  { nik: "902375", name: "DICKY FRANSSETIAJI", email: "dickyf7@gmail.com", password: "$2b$10$GftfYgFg79dqrN6gmQRPUebmeTzOgLQV4pHKeoaB.AjI5rRCVEgum", phone: "082126629106", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS BOBOS" },
  { nik: "902378", name: "SITI SHOPURO", email: "sitishoporo97@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08159276348", role: "TELLER KAS", branch: "KANTOR KAS CIWARINGIN" },
  { nik: "902382", name: "TOMI BUDIYONO", email: "tomybudiyono97@gmail.com", password: "$2b$10$urJMSg4OAMnxiD9OKPaysuqQVuwgXTjEbiU.lG17lv/rGNkVqb4xW", phone: "087784971305", role: "LOAN OFFICER", branch: "KANTOR KAS CILEDUG" },
  { nik: "902383", name: "RISKA HEIRIKA", email: "rikaheirika01@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08991557265", role: "TELLER KAS", branch: "KANTOR KAS TALUN" },
  { nik: "902384", name: "RAHMAWATI RATU SAZKIA", email: "rahmawatirs.131@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082119854592", role: "TELLER KAS", branch: "KANTOR KAS SINDANG LAUT" },
  { nik: "902387", name: "MAJID HAKIM", email: "majidhakim19@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089654677115", role: "LOAN OFFICER", branch: "KANTOR KAS ARJAWINANGUN" },
  { nik: "902388", name: "DEA", email: "deajunaedi@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085749562256", role: "CUSTOMER SERVICE", branch: "KANTOR PUSAT" },
  { nik: "902389", name: "OSCAR PELANI", email: "oscarpelani205@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082219032071", role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902391", name: "HELMI SEPTIANDA", email: "helmiseptianda560@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082219166144", role: "STAFF SPI", branch: "KANTOR PUSAT" },
  { nik: "902393", name: "ILYAS DIRGAS MALDA", email: "ilyasmalda27@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "083107149572", role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902396", name: "APRIYANTO", email: "apriy3724@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089699838119", role: "SECURITY", branch: "KANTOR PUSAT" },
  { nik: "902399", name: "ANTON SUTRISNO", email: "Vinovinoy15@gmail.com", password: "$2b$10$T94gIG1nAhWluXXWMN.y3eExLTIZF2qPfkB7jaEWg8PZJLtIfQQ1K", phone: "085724260002", role: "LOAN OFFICER", branch: "KANTOR KAS BOBOS" },
  { nik: "902401", name: "SUHERMAN", email: "armandsuherman48@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082119568075", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS GEGESIK" },
  { nik: "902407", name: "ADE TRIANI ISTIQOMAH", email: "adetriani81@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089529971959", role: "ADMIN KREDIT", branch: "KANTOR PUSAT" },
  { nik: "902408", name: "DIANA PRIHATINI", email: "dianaprihartini@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081909824555", role: "ADMIN KREDIT", branch: "KANTOR PUSAT" },
  { nik: "902409", name: "SUTANTO", email: "sutantosutanto45@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08156671761", role: "KOMISARIS", branch: "KANTOR PUSAT" },
  { nik: "902410", name: "NURFITRIAH", email: "nurfitriyah240@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "083152274983", role: "LOAN OFFICER", branch: "KANTOR KAS GEGESIK" },
  { nik: "902414", name: "IMAM PATUROHMAN", email: "imamfaturohman01@gmail.com", password: "$2b$10$U1IH6BV9N5XsFbZI2kIle.wkpNCAdOZXwBLXqq4Ku/4Jng.74MzBu", phone: "0895334565919", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS SEDONG" },
  { nik: "902416", name: "YULIANA ANGGRADINI PUTRI", email: "yuliana.anggra98@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085721022704", role: "TELLER KAS", branch: "KANTOR KAS CANGKOAK" },
  { nik: "902420", name: "EMIN MUHAEMIN", email: "902420@bprss.com", password: "$2b$10$GL8J9PAuY.ch3taEBAy.te4mwzVczlApjaZFF70rB7AEWu2zxpHlG", phone: "087880984371", role: "LOAN OFFICER", branch: "KANTOR KAS CILEDUG" },
  { nik: "902421", name: "HERU LESMANA", email: "herulesmana411@gmail.com", password: "$2b$10$k8Uli/3RKqnX/YdzZIyTYexR8VyPiDv6SorqEhG/DDlG24Y7VUM06", phone: "083146803432", role: "LOAN OFFICER", branch: "KANTOR KAS BEBER" },
  { nik: "902423", name: "ANDI GALIH", email: "andgalih38560@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "083173296047", role: "LOAN OFFICER", branch: "KANTOR KAS SEDONG" },
  { nik: "902425", name: "ROSHEFA", email: "roshefaadkiya@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089670004391", role: "CUSTOMER SERVICE", branch: "KANTOR KAS GEGESIK" },
  { nik: "902426", name: "KRISTI NATALIA MANULLANG", email: "manullangkristi@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "0895386130124", role: "TELLER KAS", branch: "KANTOR KAS BEBER" },
  { nik: "902429", name: "MINERVA SORAYA", email: "minervasoraya05@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085779008403", role: "CUSTOMER SERVICE", branch: "KANTOR KAS CANGKOAK" },
  { nik: "902430", name: "DWI PUTRI SEPTIRIANI", email: "dwipseptiriani@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "083869664939", role: "CUSTOMER SERVICE", branch: "KANTOR KAS KARANGSEMBUNG" },
  { nik: "902431", name: "ATI SUMIYATI", email: "atisumiyati1313@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082128884524", role: "CUSTOMER SERVICE", branch: "KANTOR KAS SEDONG" },
  { nik: "902432", name: "AULIA AYU MASTIKA", email: "auliaayumastika@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082116653206", role: "ADMIN LEGAL", branch: "KANTOR PUSAT" },
  { nik: "902434", name: "AIMATUS SA'DIYAH", email: "aimatus.npm700@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085321689678", role: "ACCOUNTING", branch: "KANTOR PUSAT" },
  { nik: "902438", name: "RESHA ADITIO SUHERMAN", email: "aditioaditio79@gmail.com", password: "$2b$10$hTD.V2OtM3OIQ3owLg88mu2T52CSF/Aj2UZx/X8GYYvV/kvN2Zqg6", phone: "083823253197", role: "LOAN OFFICER", branch: "KANTOR KAS BEBER" },
  { nik: "902439", name: "TANIA FAJRIATI", email: "taniafajriatibudiman@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082115301887", role: "TELLER KAS", branch: "KANTOR KAS SEDONG" },
  { nik: "902440", name: "ARIF BUDIANTO", email: "arifaskatw@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "0895613333351", role: "OB", branch: "KANTOR PUSAT" },
  { nik: "902441", name: "TIUR REZEKINA MANULLANG", email: "tiur.manullang31@gmail.com", password: "$2b$10$8suBCxgXdap799i4Bkz.PuedIeIgf6eFKpt.juFJuRHlrliWzcRx6", phone: "081222121600", role: "LOAN OFFICER", branch: "KANTOR KAS TALUN" },
  { nik: "902443", name: "DESI HARDIYANTI", email: "desihardiyanti338@gmail.com", password: "$2b$10$OTF5V.RckO9nZPEMDXVh4u7ZU5UyvzU8PMh8gV.32UlJRB6Pczg7K", phone: "08987361821", role: "LOAN OFFICER", branch: "KANTOR KAS CANGKOAK" },
  { nik: "902446", name: "SRI NURHAYATI", email: "nuy3628@gmail.com", password: "$2b$10$oHrQNaEEvdqY8ygT0z0.GO9PD0HhaixZcG3Tg/PeS7SLqf41zHX6K", phone: "085216473220", role: "LOAN OFFICER", branch: "KANTOR PUSAT" },
  { nik: "902448", name: "WIDANINGRUM", email: "nwida728@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082136617185", role: "CUSTOMER SERVICE", branch: "KANTOR KAS CILEDUG" },
  { nik: "902451", name: "YAUMIL AWALIYAH", email: "yaumilawlyh@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082234560051", role: "ADMIN KREDIT", branch: "KANTOR PUSAT" },
  { nik: "902453", name: "EVA TRIANA HUTAMI", email: "ethevatriana@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081902221855", role: "CUSTOMER SERVICE", branch: "KANTOR KAS ARJAWINANGUN" },
  { nik: "902455", name: "HENDRIK SIBARANI", email: "hendrikyuki70@gmail.com", password: "$2b$10$5YhR7stV00ypBv5i5kL.2OoIUB.zdvXYKvBKDbAR2DO8kS5Z491SG", phone: "085221761387", role: "AREA MANAGER", branch: "KANTOR PUSAT" },
  { nik: "902457", name: "DAHLIA RIZQI SAFIRAH", email: "safirahdahliarizky@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085794729585", role: "TELLER KAS", branch: "KANTOR KAS BOBOS" },
  { nik: "902460", name: "ARIANA", email: "kadek311298@gmail.com", password: "$2b$10$99Qk4TgvErzBabamOvTwje.nWmSct8pGE3p3nJKTKZnL.1aqSkeFG", phone: "083125743014", role: "LOAN OFFICER", branch: "KANTOR KAS KARANGSEMBUNG" },
  { nik: "902464", name: "RIKA HERADIANI PUTRI", email: "putririka@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081990994548", role: "CUSTOMER SERVICE", branch: "KANTOR KAS BOBOS" },
  { nik: "902465", name: "EVITA OKTAVIANI", email: "vitaoktaviani.sms@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081367121499", role: "TELLER KAS", branch: "KANTOR KAS CILEDUG" },
  { nik: "902468", name: "M.ALIF GYMNASTIAR DANUARTA", email: "902468@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: null, role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902467", name: "DEA INTAN PRATIWI", email: "deaintanp5@gamil.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081220821394", role: "ADMIN KREDIT", branch: "KANTOR PUSAT" },
  { nik: "902469", name: "MUHAMMAD KHAERUL ANAM", email: "khaerulanam1902@gmail.com", password: "$2b$10$ok7yyjRXp2R8X2F8m17PbuqVG5UW9l04Dfa1EufG4dBENm7fCfKAu", phone: "081322186105", role: "LOAN OFFICER", branch: "KANTOR KAS PABEDILAN" },
  { nik: "902470", name: "ASEP SUPRIYADI", email: "asep.tea041185@gmail.com", password: "$2b$10$fL57YCdnG5QnkopjueOj1OXMeSTuV2YcCoxa4Lqv6YQxpHSWhQRyW", phone: "082228882390", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS CILEDUG" },
  { nik: "902471", name: "IHZA MAHENDRA", email: "ihzan472@gmail.com", password: "$2b$10$QRoefr9Y.oYh8/vOnpm.heGkuj1JsTSDWSDk.bK/IixIcmbg3XpP2", phone: "082120354435", role: "LOAN OFFICER", branch: "KANTOR KAS KARANGSEMBUNG" },
  { nik: "902472", name: "BAYU SAPUTRA", email: "ferivikasiakunadna@gmail.com", password: "$2b$10$RixlcAo.Awe4BknzGmiAgOFqH0BNAKZMQJKa6McIVhctA.oDYbFw6", phone: "082120785684", role: "LOAN OFFICER", branch: "KANTOR KAS SEDONG" },
  { nik: "902473", name: "ADHIANSYAH PRATAMA", email: "adhipratama373@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081312078366", role: "LOAN OFFICER", branch: "KANTOR KAS SUMBER" },
  { nik: "902474", name: "E. NANA SUBARNA", email: "902474@bprss.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "087752758770", role: "DRIVER", branch: "KANTOR PUSAT" },
  { nik: "902475", name: "YANTI HERDIYAWATI", email: "yantiherdiyawati@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082115740416", role: "TELLER KAS", branch: "KANTOR KAS GEGESIK" },
  { nik: "902476", name: "AHMAD HIDAYAT", email: "abayhidayat@gmail.com", password: "$2b$10$4xl0XSZaLV1IdqZEVSN8YOiwDEm.gQlzZeoxrOqJt0oF4XbWdASW6", phone: "085608383601", role: "LOAN OFFICER", branch: "KANTOR KAS SEDONG" },
  { nik: "902478", name: "LAELATUL HIDAYAH", email: "laelatulhidayah@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089653458587", role: "TELLER KAS", branch: "KANTOR KAS KARANGSEMBUNG" },
  { nik: "902479", name: "NUR KHOLIFAH", email: "nurkholifah.lifa02@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08979027754", role: "TELLER PUSAT", branch: "KANTOR PUSAT" },
  { nik: "902480", name: "REYNALDI FAUZI CHANDRA", email: "reynaldifauzichandra@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08983493126", role: "STAFF IT", branch: "KANTOR PUSAT" },
  { nik: "902482", name: "DIRMAN SAMPETUA FERNANDO", email: "dirman.sampetua@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082117699976", role: "KEPALA KANTOR KAS", branch: "KANTOR KAS SUMBER" },
  { nik: "902483", name: "SENDI NURCAHYA", email: "sendinurcahya223344@gmail.com", password: "$2b$10$cTfMAEOrGOlwL/V2xci/AeEuoSMZpJNuVqmRkDdWKtwvybM6esl4y", phone: "082320234357", role: "LOAN OFFICER", branch: "KANTOR KAS TALUN" },
  { nik: "902484", name: "NAURA LUTFIYA", email: "nauralutfiyaa@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081220045609", role: "ADMIN LEGAL", branch: "KANTOR PUSAT" },
  { nik: "902485", name: "BAGJA AL AMIN", email: "bagjaamin05@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "089698915549", role: "STAFF IT", branch: "KANTOR PUSAT" },
  { nik: "902486", name: "FEBI INDRIANI", email: "indriyanifeby00@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "088970569161", role: "CUSTOMER SERVICE", branch: "KANTOR KAS SUMBER" },
  { nik: "902487", name: "SYARIFAH JAFNAH ARUM", email: "afnahsyarifah@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085872591534", role: "TELLER KAS", branch: "KANTOR KAS ARJAWINANGUN" },
  { nik: "902488", name: "DWI SAFILA DAYARANI", email: "dwisafila10@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082120785882", role: "CUSTOMER SERVICE", branch: "KANTOR KAS BEBER" },
  { nik: "902489", name: "ENTIN PRIHATINI", email: "titinpht28@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081223830599", role: "TELLER KAS", branch: "KANTOR KAS PABEDILAN" },
  { nik: "902490", name: "EMAN DARSIMAN", email: "emandarsimam@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081383335114", role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902491", name: "ROSSI WIDANINGSIH", email: "pionss655@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "083142033129", role: "LOAN OFFICER", branch: "KANTOR KAS GEGESIK" },
  { nik: "902492", name: "SITI IKHWA", email: "sitiikhwaftrn22@gmail.com", password: "$2b$10$jFef.0JSlxsTh5jJHKZyuuvoykUeoxUk3WZzWn/EuHKHbdGT6CsvW", phone: "081310569250", role: "LOAN OFFICER", branch: "KANTOR KAS BOBOS" },
  { nik: "902494", name: "MUHAMAD RIZKI", email: "rizkibonot2@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "08988904909", role: "LOAN OFFICER", branch: "KANTOR KAS SINDANG LAUT" },
  { nik: "902495", name: "ZAHID ABU ZAKARIYAH MUHYIDIN NAWAWI", email: "zahidabuzakariyah@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "082119192740", role: "LOAN OFFICER", branch: "KANTOR KAS SUMBER" },
  { nik: "902498", name: "JAKARIA SIDIK", email: "4zkasidik@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085283494748", role: "REMEDIAL", branch: "KANTOR PUSAT" },
  { nik: "902499", name: "R. HIMAWAN TRI IRWANTO", email: "himtri2112@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085920626012", role: "BUSINESS MANAGER", branch: "KANTOR PUSAT" },
  { nik: "902500", name: "MUHAMAD HASYIM ABDULLAH", email: "hasyimjr123slowbe@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "087899919567", role: "LOAN OFFICER", branch: "KANTOR KAS CIWARINGIN" },
  { nik: "902502", name: "AAN NURDIANSYAH", email: "aannurdiansyah17@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "085724913247", role: "LOAN OFFICER", branch: "KANTOR KAS WALED" },
  { nik: "902509", name: "ROBYATNA ALIMUDIN", email: "robyatna27@gmail.com", password: "$2b$10$n26HN3L3q/sPgIVQp9.gDuUdd.u.NyCLX6yj0HT3Asg9h2l4bRzSC", phone: "081214411140", role: "LOAN OFFICER", branch: "KANTOR KAS BEBER" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // 1. Super Admin
  console.log("Seeding super admin...");
  await prisma.admin.upsert({
    where: { email: SUPER_ADMIN.email },
    update: { password: SUPER_ADMIN.password, role: "SUPER_ADMIN", status: "ACTIVE" },
    create: {
      name: SUPER_ADMIN.name,
      email: SUPER_ADMIN.email,
      password: SUPER_ADMIN.password,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    },
  });
  console.log(`  ✓ ${SUPER_ADMIN.email}`);

  // 2. Fetch semua branch sekali → map name → id
  console.log("\nMemuat data kantor...");
  const branches = await prisma.branch.findMany({ select: { id: true, name: true } });
  const branchMap = Object.fromEntries(branches.map((b) => [b.name, b.id]));

  const missing = [...new Set(EMPLOYEES.map((e) => e.branch))].filter((b) => !branchMap[b]);
  if (missing.length > 0) {
    console.warn(`  ⚠ Branch tidak ditemukan di DB: ${missing.join(", ")}`);
    console.warn("  Jalankan seed-branch.js terlebih dahulu.");
    process.exit(1);
  }

  // 3. Employees
  console.log(`\nSeeding ${EMPLOYEES.length} karyawan...`);
  let ok = 0, skip = 0;

  for (const emp of EMPLOYEES) {
    const branchId = branchMap[emp.branch];
    try {
      await prisma.employee.upsert({
        where: { nik: emp.nik },
        update: {
          name: emp.name,
          email: emp.email,
          password: emp.password,
          phone: emp.phone,
          role: emp.role,
          branchId,
        },
        create: {
          nik: emp.nik,
          name: emp.name,
          email: emp.email,
          password: emp.password,
          phone: emp.phone,
          role: emp.role,
          branchId,
          isActive: true,
        },
      });
      ok++;
    } catch (e) {
      console.warn(`  ✗ ${emp.nik} ${emp.name}: ${e.message}`);
      skip++;
    }
  }

  console.log(`\n  ✓ Berhasil: ${ok}`);
  if (skip > 0) console.log(`  ✗ Gagal   : ${skip}`);
  console.log("\nSeeding selesai.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
