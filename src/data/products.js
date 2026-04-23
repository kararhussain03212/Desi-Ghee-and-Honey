import slide1 from '../assets/images/slide1.jpg'
import slide2 from '../assets/images/slide2.jpg'
import mockuphoney from '../assets/images/mockuphoney.png'
// import honeyL from '../assets/images/honeyL.png'
import cow1 from '../assets/images/cow.png'
import desiGhee from '../assets/images/desighee.jpg'
import goat from '../assets/images/goat.png'
import buff from '../assets/images/buffalo.png'
import honey2 from '../assets/images/honey2.jpg'
import cow from '../assets/images/cow.png'

export const products = [
  {
    id: 'Goat-Desi-Ghee',
    code: 'HG-GHEE-001',
    badge: '-28%',
    image: goat,
    title: 'Goat Desi Ghee',
    price: 7000,
    oldPrice: null,
    variants: [
      { label : '1kg', price: 7000 },
      { label : '500g', price: 3500 },
    ],
    rating: 4,
  },
  {
    id: 'Raw-honey',
    code: 'HG-HNY-002',
    badge: '-25%',
    image: mockuphoney,
    title: 'Honey Small Bees',
    price: 8000,
    oldPrice: null,
    variants: [
      { label: '1kg', price: 8000 },
      { label: '500g', price: 4000 },
    ],
    rating: 3.5,
  },
  {
    id: 'wildflower-honey',
    code: 'HG-HNY-003',
    badge: 'New',
    image: buff,
    title: 'Buffalo Ghee',
    price: 3600,
    variants: [
      { label: '1kg', price: 3600 },
      { label: '500g', price: 1800 },
    ],
    oldPrice: 98,
    rating: 3,
  },
  {
    id: 'queen-bee-honey',
    code: 'HG-HNY-004',
    badge: '-20%',
    image: cow1,
    title: 'Cow Desi Ghee',
    price: 4000,
    variants: [
      { label: '1kg', price: 4000 },
      { label: '500g', price: 2000 },
    ],
    oldPrice: 98,
    rating: 4,
  },

  // {
  //   id: 'black-seed-flower-honey',
  //   code: 'HG-HNY-007',
  //   badge: '-15%',
  //   image: mockuphoney,
  //   title: 'Black Seed Flower Honey',
  //   price: 8000,
  //   variants: [
  //     { label: '1kg', price: 8000 },
  //     { label: '500g', price: 4000 },
  //   ],
  //   oldPrice: 98,
  //   rating: 5,
  // },
  // {
  //   id: 'mustard-flower-honey',
  //   code: 'HG-HNY-008',
  //   badge: 'New',
  //   image: desiGhee,
  //   title: 'Cow Desi Ghee',
  //   price: 4000,
  //   variants: [
  //     { label: '1kg', price: 4000 },
  //     { label: '500g', price: 2000 },
  //   ],
  //   oldPrice: 198,
  //   rating: 5,
  // },
  // {
  //   id: 'honey-comb',
  //   code: 'HG-HNY-009',
  //   badge: 'New',
  //   image: honey2,
  //   title: 'Honey Comb',
  //   price: 8000,
  //   variants: [
  //     { label: '1kg', price: 8000 },
  //     { label: '500g', price: 4000 },
  //   ],
  //   oldPrice: 150,
  //   rating: 5,
  // },
  // {
  //   id: 'pure-cow-ghee',
  //   code: 'HG-GHEE-010',
  //   badge: 'New',
  //   image: cow,
  //   title: 'Pure Cow Ghee',
  //   price: 4000,
  //   oldPrice: null,
  //   variants: [
  //     { label: '1kg', price: 4000 },
  //     { label: '500g', price: 2000 },
  //   ],
  //   rating: 5,
  // },
]
