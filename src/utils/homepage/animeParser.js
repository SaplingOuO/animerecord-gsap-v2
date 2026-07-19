/**
 * 將json檔案轉化為vue可讀取資料
 * @param {Object} animeData  
 */

export function groupAnimeData(animeData) {
  return animeData.reduce((acc, anime) => {
    // 1. 🔍 從 "2026年07月12日" 擷取出年份 "2026"
    const yearMatch = anime.releaseDate.match(/(\d+)年/);
    const year = yearMatch ? yearMatch[1] : '其他';

    // 2. 🍉 取得季節，例如 "夏季"
    const season = anime.season || '其他';

    // 3. 🏗️ 建立巢狀結構
    if (!acc[year]) acc[year] = {};
    if (!acc[year][season]) acc[year][season] = [];

    // 4. 📥 將此動漫資料放入對應的分類中
    acc[year][season].push(anime);

    return acc;
  }, {});
}

/**
 * 根據年份與季節過濾已分類的動漫資料
 * @param {Object} groupedData - 完整的分類資料
 * @param {string} targetYear - 使用者選取的年份
 * @param {string} targetSeason - 使用者選取的季節
 */
export function filterAnimeData(groupedData, targetYear, targetSeason) {
  const result = {};

  // 1. 遍歷所有的年份
  for (const year in groupedData) {
    // 如果使用者選了特定年份，且不是目前巡迴到的年份，就跳過
    if (targetYear !== '全部' && targetYear !== year) {
      continue;
    }

    result[year] = {};

    // 2. 遍歷該年份下的所有季節
    for (const season in groupedData[year]) {
      // 如果使用者選了特定季節，且不是目前巡迴到的季節，就跳過
      if (targetSeason !== '全部' && targetSeason !== season) {
        continue;
      }

      // 3. 留下來的就是符合篩選條件的動漫陣列
      result[year][season] = groupedData[year][season];
    }

    // 如果該年份過濾後沒有任何季節有資料，就把該年份刪除，避免畫面上出現空標題
    if (Object.keys(result[year]).length === 0) {
      delete result[year];
    }
  }

  return result;
}

/**
 * 計算篩選後的動漫總部數
 * @param {Object} filteredAnimeData - 篩選後的純資料物件
 * @returns {number} sum - 總部數
 */
export function totalAnimeCount(filteredAnimeData) {
  let sum = 0;
  
  // 🎯 這裡直接使用傳進來的 raw 物件，不使用 .value
  for (const year in filteredAnimeData) {
    for (const season in filteredAnimeData[year]) {
      sum += filteredAnimeData[year][season].length;
    }
  }
  
  return sum;
}

/**
 * 依據總部數，計算出每一直行應該放幾部動畫 (y)
 * @param {number} totalCount - 該季節的動畫總數
 * @returns {number} rowsPerColumn - 每一直行放置的數量
 */
export function getRowsPerColumn(totalCount){
  if (totalCount === 0) return 0;

  // 在 8 部以上執行開根號
  if (totalCount >= 8) {
    return Math.floor(Math.sqrt(totalCount));
  }else{
    return 1
  }
}

/**
 * 將單層的動漫陣列，切分成每 rowsPerColumn 個一組的二維陣列
 * @param {Array} animeList - 原始的單層動漫陣列
 * @returns {Array} - 切分後的二維陣列
 */
export function chunkAnimeList(animeList, rowsPerColumn) {
  let i = 0;
  const result = [];
  const flatList = [];
  // 將篩選資料匯入壓成單層陣列
  for(const year in animeList){
    for(const season in animeList[year]){
      flatList.push(...animeList[year][season]);
    }
  }

  // 每次切 rowsPerColumn 個項目，直到把陣列跑完
  while (i < flatList.length) {
    result.push(flatList.slice(i, i + rowsPerColumn));
    i += rowsPerColumn; // 跳到下一個 rowsPerColumn 個項目
  }

  console.log('接收到的資料：',animeList);
  console.log('壓平後的資料：',flatList);
  return result;
}