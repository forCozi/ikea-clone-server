import express from 'express';
import BCatecory from '../db/models/BigCategory';
import HomeFurnishing from '../db/models/homeFurnishing';
import Product from '../db/models/product';
import ProdImage from '../db/models/productImage';
import SCatecory from '../db/models/smallCategory';
import PRODUCT from './data/product-data/홈오피스상품.json';
import HFLIST from './data/home-funising/홈오피스.json';
import HFImage from '../db/models/hfImage';
import HFProduct from '../db/models/hfProduct';
const router = express.Router();
const navData = [
  {
    id: 1,
    name: '홈스마트',
    detail: [
      { id: 1, name: '리모콘/무선장치' },
      { id: 2, name: '스마트시스템' },
      { id: 3, name: '스마트 조명' },
      { id: 4, name: '전동 블라인드' },
    ],
  },
  {
    id: 2,
    name: '가구',
    detail: [
      { id: 5, name: '소파/암체어' },
      { id: 6, name: '침대' },
      { id: 7, name: '옷장' },
      { id: 8, name: '식탁/책상' },
      { id: 9, name: '의자' },
      { id: 10, name: 'TV/멀티미디어가구' },
      { id: 11, name: '책장/선반유닛' },
      { id: 12, name: '서랍' },
      { id: 13, name: '수납장/장식장' },
      { id: 14, name: '이동식 선반' },
      { id: 15, name: '야외용 가구' },
      { id: 16, name: '바테이블/의자' },
      { id: 17, name: '카페가구' },
      { id: 18, name: '거실장/찬장/콘솔테이블' },
      { id: 19, name: '칸막이/파티션' },
      { id: 20, name: '어린이가구' },
      { id: 21, name: '영아용가구' },
    ],
  },
  {
    id: 3,
    name: '침대/매트리스',
    detail: [
      { id: 22, name: '침대' },
      { id: 23, name: '매트리스' },
      { id: 24, name: '침구' },
      { id: 25, name: '침대수납' },
      { id: 26, name: '침대협탁' },
      { id: 27, name: '침대갈빗살' },
      { id: 28, name: '침대헤드' },
      { id: 29, name: '메트리스 베이스' },
      { id: 30, name: '침대다리' },
    ],
  },
  {
    id: 4,
    name: '수납/정리',
    detail: [
      { id: 31, name: '옷장' },
      { id: 32, name: 'TV/멀티미디어' },
      { id: 33, name: '책장/선반유닛' },
      { id: 34, name: '수납장/장식장' },
      { id: 35, name: '서랍' },
      { id: 36, name: '후크/벽수납' },
      { id: 37, name: '거실장/찬장/콘솔테이블' },
      { id: 38, name: '수납 솔루션 시스템' },
      { id: 39, name: '이동식 선반' },
      { id: 40, name: '스탠드 옷걸리/신발 수납' },
      { id: 41, name: '소형 수납' },
      { id: 42, name: '이동 보조용품' },
      { id: 43, name: '가방' },
    ],
  },
  {
    id: 5,
    name: '주방가구',
    detail: [
      { id: 44, name: '주방 시스템' },
      { id: 45, name: '주방 벽패널' },
      { id: 46, name: '주방 부속품' },
      { id: 47, name: '주방 싱크대/수도' },
      { id: 48, name: '주방 가전' },
      { id: 49, name: '주방 조리대' },
      { id: 50, name: '주방 조명' },
      { id: 51, name: '주방 아일랜드/키트' },
      { id: 52, name: '주방 벽수납' },
      { id: 53, name: '주방 손잡이' },
      { id: 54, name: '주방 모듈형' },
      { id: 55, name: '주방 펜트리' },
    ],
  },
  {
    id: 6,
    name: '어린이 IKEA',

    detail: [
      { id: 56, name: '영유아' },
      { id: 57, name: '어린이' },
    ],
  },
  {
    id: 7,
    name: '텍스타일',
    detail: [
      { id: 58, name: '침구' },
      { id: 59, name: '커튼/블라인드' },
      { id: 60, name: '욕실 텍스타일' },
      { id: 61, name: '영아용 텍스타일' },
      { id: 62, name: '어린이 텍스타일' },
      { id: 63, name: '패브릭/재봉' },
      { id: 64, name: '주방 텍스타일' },
      { id: 65, name: '테이블 텍스타일' },
      { id: 66, name: '야외용 텍스타일' },
      { id: 67, name: '담요/스로우' },
    ],
  },
  {
    id: 8,
    name: '홈데코',
    detail: [
      { id: 68, name: '화분' },
      { id: 69, name: '양초/홀더' },
      { id: 70, name: '액자/그림/포스터' },
      { id: 71, name: '거울' },
      { id: 72, name: '식물/조화' },
      { id: 73, name: '꽃병/수반' },
      { id: 74, name: '수납함/바구니' },
      { id: 75, name: '시계' },
      { id: 76, name: '장식용품' },
      { id: 77, name: '실내 향' },
      { id: 78, name: '메모판' },
      { id: 79, name: '종이제품' },
      { id: 80, name: '겨울용 소품' },
    ],
  },
  {
    id: 9,
    name: '조명',
    detail: [
      { id: 81, name: 'LED 조명 전구' },
      { id: 82, name: '장식조명' },
      { id: 83, name: '조명' },
      { id: 84, name: '스마트 조명' },
      { id: 85, name: '시스템 조명' },
      { id: 86, name: '야외 조명' },
    ],
  },
  {
    id: 10,
    name: '주방용품',
    detail: [
      { id: 87, name: '주방용품' },
      { id: 88, name: '식품보관/정리' },
      { id: 89, name: '조리용품/제빵도구' },
      { id: 90, name: '제빵도구' },
      { id: 91, name: '칼/도마' },
      { id: 92, name: '디너웨어' },
      { id: 93, name: '유리제품 & 유리병' },
      { id: 94, name: '식기도구' },
      { id: 95, name: '커피/차' },
      { id: 96, name: '서빙웨어' },
      { id: 97, name: '냅킨/냅킨홀더' },
      { id: 98, name: '식기세척용품' },
      { id: 99, name: '주방텍스타일' },
      { id: 100, name: '테이블 텍스타일' },
      { id: 101, name: '어린이 식기' },
    ],
  },
  {
    id: 11,
    name: '욕실',
    detail: [
      { id: 102, name: '욕실용품' },
      { id: 103, name: '욕실 텍스타일' },
      { id: 104, name: '욕실수납' },
      { id: 105, name: '욕실거울' },
      { id: 106, name: '욕실 스툴/벤치' },
      { id: 107, name: '욕실 세면대' },
      { id: 108, name: '욕실 수도꼭지' },
      { id: 109, name: '욕실 샤워기' },
      { id: 110, name: '욕실 조명' },
      { id: 111, name: '욕실 가구세트' },
      { id: 112, name: '욕실 세탁' },
    ],
  },
  {
    id: 12,
    name: '러그/매트/조립가구',
    detail: [
      { id: 113, name: '러그' },
      { id: 114, name: '욕실매트' },
      { id: 115, name: '도어매트' },
      { id: 116, name: '조립마루' },
    ],
  },
  {
    id: 13,
    name: '야외용 제품',
    detail: [
      { id: 117, name: '야외용 가구' },
      { id: 118, name: '야외정리용품' },
      { id: 119, name: '야외화분/식물' },
      { id: 120, name: '파라솔/가제보' },
      { id: 121, name: '야외용 쿠션' },
      { id: 122, name: '야외용 악세서리' },
      { id: 123, name: '야외용바닥재' },
      { id: 124, name: '바비큐' },
      { id: 125, name: '야외러그' },
      { id: 126, name: '야외조명' },
    ],
  },
  {
    id: 14,
    name: '세탁/청소',
    detail: [
      { id: 127, name: '빨래바구니' },
      { id: 128, name: '휴지통/봉투' },
      { id: 129, name: '빨래건조대' },
      { id: 130, name: '다림판' },
      { id: 131, name: '청소용품' },
      { id: 132, name: '식기세척용품' },
      { id: 133, name: '세탁 수납/선반' },
    ],
  },
  {
    id: 15,
    name: '안전용품',
    detail: [
      { id: 134, name: '어린이안전' },
      { id: 135, name: '안전관련용품' },
    ],
  },
  {
    id: 16,
    name: '셀프 인테리어',
    detail: [
      { id: 136, name: '안전' },
      { id: 137, name: '조립공구' },
      { id: 138, name: '야외용바닥재' },
      { id: 139, name: '얼룩제거용품' },
      { id: 140, name: '주방 손잡이' },
      { id: 141, name: '주방 벽패널' },
      { id: 142, name: '어쿠스틱 패널' },
      { id: 143, name: '이동 보조상품' },
    ],
  },
  {
    id: 17,
    name: '화분/식물',
    detail: [
      { id: 144, name: '화분' },
      { id: 145, name: '식물/조화' },
      { id: 146, name: '화분스탠드/이동받침' },
      { id: 147, name: '물뿌리개' },
      { id: 148, name: '원예용품' },
    ],
  },
  {
    id: 18,
    name: '가전제품',
    detail: [
      { id: 149, name: '전동 블라인드' },
      { id: 150, name: '스마트 조명' },
      { id: 151, name: '케이블/충전기' },
      { id: 152, name: '주방 가전' },
      { id: 153, name: '휴대폰/태블릿 액세서리' },
      { id: 154, name: '스피커' },
    ],
  },
  {
    id: 19,
    name: 'IKEA푸드',
    detail: [
      { id: 155, name: '여름 시즌푸드' },
      { id: 156, name: '채식/베이터리안' },
      { id: 157, name: '소스/에피타이저' },
      { id: 158, name: '스택/간식' },
      { id: 160, name: '씨푸드/해산물' },
      { id: 161, name: '빵/유제품' },
      { id: 162, name: '디저트/쿠키' },
      { id: 163, name: '잼/양념/소스' },
      { id: 164, name: '음료' },
    ],
  },
  {
    id: 20,
    name: '레저용품',
    detail: [
      { id: 165, name: '가방' },
      { id: 166, name: '게임/레저용품' },
      { id: 167, name: '종이제품' },
      { id: 168, name: '도서' },
    ],
  },
  {
    id: 21,
    name: '반려동물',

    detail: [
      { id: 169, name: '고양이' },
      { id: 170, name: '강아지' },
    ],
  },
  {
    id: 22,
    name: '여름용 소품',
    detail: [
      { id: 171, name: '여름 장식/데코' },
      { id: 172, name: '여름 조명' },
      { id: 173, name: '여름 텍스타일' },
      { id: 174, name: '여름 시즌푸드' },
      { id: 175, name: '여름 파티' },
      { id: 176, name: '정원/가드닝' },
      { id: 177, name: '바비큐' },
    ],
  },
  {
    id: 23,
    name: '겨울용 소품',
    detail: [
      { id: 178, name: '겨울 장식/데코' },
      { id: 179, name: '겨울 조명' },
      { id: 180, name: '겨울 텍스타일' },
      { id: 181, name: '겨울 테이블웨어' },
      { id: 182, name: '겨울 화분/식물' },
      { id: 183, name: '겨울 요리/제빵도구' },
      { id: 184, name: '겨울 시즌푸드' },
      { id: 185, name: '포장지/쇼핑백' },
    ],
  },
];
// function delay() {
//   return new Promise(resolve => setTimeout(resolve, 100));
// }
router.get('/insert/category', async (req, res, next) => {
  try {
    for (let i = 0; i < navData.length; i++) {
      await BCatecory.create({ id: navData[i].id, name: navData[i].name });
      for (let j = 0; j < navData[i].detail.length; j++) {
        await SCatecory.create({
          id: navData[i].detail[j].id,
          name: navData[i].detail[j].name,
          BCategoryId: navData[i].id,
        });
        // await delay();
        console.log(navData[i].detail[j].name);
      }
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/insert/product', async (req, res, next) => {
  try {
    for (let i = 0; i < PRODUCT.length; i++) {
      const bc = await BCatecory.findOne({
        where: { name: PRODUCT[i].bigCate },
      });
      const sc = await SCatecory.findOne({
        where: { name: PRODUCT[i].smallCate },
      });
      await Product.findOrCreate({
        where: { id: PRODUCT[i].product_id },
        defaults: {
          title: PRODUCT[i].title,
          prCost: PRODUCT[i].price,
          slCost: PRODUCT[i].price,
          detailInfo: PRODUCT[i].info,
          size: PRODUCT[i].size,
          summary: PRODUCT[i].summary,
          BCategoryId: bc ? bc.id : 1,
          SCategoryId: sc ? sc.id : 1,
        },
      });
      for (let j = 0; j < PRODUCT[i].images.length; j++) {
        await ProdImage.findOrCreate({
          where: { src: PRODUCT[i].images[j].src },
          defaults: {
            info: PRODUCT[i].images[j].name,
            srcSet: PRODUCT[i].images[j].srcset,
            sizes: PRODUCT[i].images[j].sizes,
            ProductId: PRODUCT[i].product_id,
          },
        });
        // await delay();
      }
      console.log(PRODUCT[i].product_id);
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/insert/hf', async (req, res, next) => {
  try {
    for (let i = 0; i < HFLIST.length; i++) {
      const hfImage = await HFImage.create({
        src: HFLIST[i].imgData.src,
        srcSet: HFLIST[i].imgData.srcset,
        sizes: HFLIST[i].imgData.sizes,
      });
      const hfItem = await HomeFurnishing.create({
        info: HFLIST[i].imgData.name,
        HFImageId: hfImage.id,
        HFCategoryId: HFLIST[i].categoryId,
      });
      for (let j = 0; j < HFLIST[i].dotData.length; j++) {
        await HFProduct.create({
          HomeFurnishingId: hfItem.id,
          ProductId: HFLIST[i].dotData[j].shortId,
          top: HFLIST[i].dotData[j].position.top,
          left: HFLIST[i].dotData[j].position.left,
        });
        // await delay();
        console.log(hfItem.id);
      }
    }
  } catch (e) {
    console.error(e);
    next(e);
  }
});

export default router;
