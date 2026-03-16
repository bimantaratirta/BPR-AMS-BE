import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const branches = [
  {
    name: "KANTOR PUSAT",
    latitude: -6.7104146,
    longitude: 108.4430965,
    address: "Jl. Raya Klangenan No.121, Klangenan, Kec. Klangenan, Kabupaten Cirebon",
  },
  {
    name: "KANTOR KAS KARANGSEMBUNG",
    latitude: -6.849178,
    longitude: 108.641853,
    address: "Jl Raya Karang Suwung RT 003 RW 003 Ds Karang Suwung Kec Karangsembung Kab Cirebon",
  },
  {
    name: "KANTOR KAS SUMBER",
    latitude: -6.752118,
    longitude: 108.488407,
    address: "Jalan Fatahillah Desa Perbutulan Kecamatan Sumber Kabupaten Cirebon",
  },
  {
    name: "KANTOR KAS PABEDILAN",
    latitude: -6.848973,
    longitude: 108.755436,
    address: "Dusun Karang Anyar, RT 002, RW 003, Desa Pabedilan Kulon, Kecamatan Pabedilan, Kab Cirebon",
  },
  {
    name: "KANTOR KAS ARJAWINANGUN",
    latitude: -6.639488,
    longitude: 108.4055,
    address: "Jl. Kebon Pring Kidul No.23 rt002 rw013 Ds. Arjawinangun Kec. Arjawinangun Kab. Cirebon",
  },
  {
    name: "KANTOR KAS BOBOS",
    latitude: -6.776113,
    longitude: 108.407239,
    address: "Blok III RT 02 RW 06 Desa Bobos Kecamatan Dukupuntang Kabupaten Cirebon",
  },
  {
    name: "KANTOR KAS CIWARINGIN",
    latitude: -6.694052,
    longitude: 108.376083,
    address: "Blok Cikaranti RT 001 RW 003 Ds Ciwaringin Kec Ciwaringin Kab Cirebon",
  },
  {
    name: "KANTOR KAS CILEDUG",
    latitude: -6.898636,
    longitude: 108.751081,
    address: "Jl. Raya Kapt Pierre Tendean Blok Karanganyar RT/RW 04/03 Ds Ciledug Lor Kec Ciledug Kab Cirebon",
  },
  {
    name: "KANTOR KAS WALED",
    latitude: -6.918956,
    longitude: 108.70793,
    address: "Jalan Dewi Sartika No. 19 Desa Waled Kota Kec Waled Kab Cirebon",
  },
  {
    name: "KANTOR KAS BEBER",
    latitude: -6.826348,
    longitude: 108.524236,
    address: "Jl Raya Cirebon Cilimus, Blok Karang Anyar RT 001 RW 002 Ds Beber Kec Beber Kab Cirebon",
  },
  {
    name: "KANTOR KAS CANGKOAK",
    latitude: -6.763519,
    longitude: 108.432011,
    address: "Blok Desa RT 014 RW 004 Ds Cangkoak Kec Dukupuntang Kab Cirebon",
  },
  {
    name: "KANTOR KAS TALUN",
    latitude: -6.762172,
    longitude: 108.513435,
    address: "Jalan Cendana Raya, RT 08, RW 007, Desa Cirebon Girang, Kecamatan Talun, Kab Cirebon",
  },
  {
    name: "KANTOR KAS SEDONG",
    latitude: -6.863126,
    longitude: 108.58589,
    address: "Jl. Kapten Mustopa RT/RW 003/003 Desa Sedonglor Kecamatan Sedong, Kab. Cirebon",
  },
  {
    name: "KANTOR KAS SINDANG LAUT",
    latitude: -6.830156,
    longitude: 108.632032,
    address: "Blok Kp Pasuruan rt019 rw007 Desa Mertapada Kulon Kec Astanajapura Kab Cirebon",
  },
  {
    name: "KANTOR KAS GEGESIK",
    latitude: -6.592896,
    longitude: 108.422497,
    address: "Dusun 01 rt001 rw002 Ds. Gegesik Lor Kec. Gegesik Kab. Cirebon",
  },
];

async function main() {
  console.log(`Seeding ${branches.length} kantor...`);

  for (const branch of branches) {
    const result = await prisma.branch.upsert({
      where: { name: branch.name },
      update: {
        latitude: branch.latitude,
        longitude: branch.longitude,
        address: branch.address,
        radius: 100,
      },
      create: {
        name: branch.name,
        latitude: branch.latitude,
        longitude: branch.longitude,
        address: branch.address,
        radius: 100,
      },
    });
    console.log(`  ✓ ${result.name}`);
  }

  console.log("Seeding selesai.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
