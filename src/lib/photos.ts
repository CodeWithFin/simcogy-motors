function unsplash(id: string) {
  return `https://images.unsplash.com/${id}?q=80&w=2400&auto=format&fit=crop`;
}

export const photos = {
  suvDesert: unsplash("photo-1533473359331-0135ef1b58bf"),
  suvMist: unsplash("photo-1519641471654-76ce0107ad1b"),
  coupeSunset: unsplash("photo-1603584173870-7f23fdae1b7a"),
  garage: unsplash("photo-1492144534655-ae79c964c9d7"),
  suvRoad: unsplash("photo-1617469767053-d3b523a0b982"),
  windingRoad: unsplash("photo-1568605117036-5fe5e7bab0b7"),
  showroom: unsplash("photo-1502877338535-766e1452684a"),
  dusk: unsplash("photo-1580273916550-e323be2ae537"),
  desertCoupe: unsplash("photo-1552519507-da3b142c6e3d"),
};

export const placeholderCarPhoto = photos.coupeSunset;
