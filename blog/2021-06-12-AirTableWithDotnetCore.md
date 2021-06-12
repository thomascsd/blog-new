---
title: 將AirTable做為資料庫的心得 - .net core 篇
bgImageUrl: assets/images/20/20-0.jpg
published: true
---

我在上一篇的文章[將 AirTable 做為資料庫的心得](https://thomascsd.github.io/blog/2021-04-24-AirtableAsDatabase)，有寫到：我為什麼使用 [AirTable](https://airtable.com/) 當作資料庫，以及優、缺點，並且環境是 Node.js ，語言是 TypeScript ，而這次想要使用 .net core 、 C# 來改寫。

## 串接 AirTable

<img class="img-responsive" loading="lazy" src="assets/images/20/20-01.png">

串接 AirTable 所需要的 APIKey、BaseID，可以參考的上一篇的文章，而連結 AirtTable 使用的套件是 [airtable.net](https://github.com/ngocnicholas/airtable.net) ，並且使用 Nuget 安裝即可。

## 建立泛型類別

仿造原本 TypeScript 的寫法，寫一個泛型類別，將取得資料、新增、修改及刪除都封裝起來。

```cs
public class DataService : IDataService
    {
        private string m_ApiKey;

        public DataService(IConfiguration configuration)
        {
            this.m_ApiKey = configuration.GetValue<string>("AirTable:ApiKey");
        }

        public async Task<IEnumerable<T>> GetDatas<T>(string baseId, string tableName) where T : BaseModel
        {
           ........
        }

        public async Task<AirtableCreateUpdateReplaceRecordResponse> SaveData<T>(string baseId, string tableName, T model) where T : BaseModel
        {
          ...........
        }

        public async Task<AirtableCreateUpdateReplaceRecordResponse> UpdateData<T>(string baseId, string tableName, T model) where T : BaseModel
        {
         ...........
        }

        public async Task<AirtableDeleteRecordResponse> DeleteData(string baseId, string tableName, string id)
        {
          ............ 
        }
```

## 取得資料

```cs
// BaseModel.cs
public class BaseModel
    {
        public string Id { get; set; }
    }
```

```cs
// DataService.cs
public async Task<IEnumerable<T>> GetDatas<T>(string baseId, string tableName) where T : BaseModel
        {
            string offset = null;
            List<T> models = new List<T>();
            List<AirtableRecord<T>> records = new List<AirtableRecord<T>>();
            AirtableListRecordsResponse<T> res;

            using (AirtableBase airtable = new AirtableBase(this.m_ApiKey, baseId))
            {
                do
                {
                    res = await airtable.ListRecords<T>(tableName, offset);
                    records.AddRange(res.Records);
                    offset = res.Offset;
                } while (offset != null);
            }

            models = records
                .Select(m =>
                {
                    m.Fields.Id = m.Id;
                    return m.Fields;
                })
                .ToList();

            return models;
        }
```

可以先參考 [airtable.net](https://github.com/ngocnicholas/airtable.net) 的 GitHub，建立 `AirtableBase` 的實體，之後用 `ListRecords<T>` 泛型方法，讀取 AirTable 中的資料。

再來使用 `Select` 方法轉換物件，取得屬性 `Fields` ，並且將由 AirTable 自動產生的 `Id` 鍵值保存下來。

<img class="img-responsive" loading="lazy" src="assets/images/20/20-02.png">

最後使用 Postman 測試，Response 的結果如上圖所示，而 `id` 就是 AirtTable 自動產生的 `Id` 鍵值。

## 新增資料

```cs
public async Task<AirtableCreateUpdateReplaceRecordResponse> SaveData<T>(string baseId, string tableName, T model) where T : BaseModel
        {
            var fields = this.GetFields<T>(model);
            AirtableCreateUpdateReplaceRecordResponse res;

            using (AirtableBase airTable = new AirtableBase(this.m_ApiKey, baseId))
            {
                res = await airTable.CreateRecord(tableName, fields);
            }

            return res;
        }

private Fields GetFields<T>(T model) where T : BaseModel
        {
            var dic = new Dictionary<string, object>();
            var props = typeof(T).GetProperties();

            foreach (var prop in props)
            {
                object value = prop.GetValue(model);
                dic.Add(prop.Name, value);
            }

            var fields = new Fields
            {
                FieldsCollection = dic
            };

            return fields;
        }
```

在寫入資料前需要進行處理，建立方法 `GetFields<T>` 來處理，因為`Fields`內部是使用`Dctionary<Tkey, TValue>`來保存資料，所以採用反射的方式，將`T `輔換成`Dctionary<Tkey, TValue>`。
之後新增資料使用`CreateRecord`方法，將`Fields`物件傳入。

## 修改資料

```cs
public async Task<AirtableCreateUpdateReplaceRecordResponse> UpdateData<T>(string baseId, string tableName, T model) where T : BaseModel
        {
            var fields = this.GetFields<T>(model);
            AirtableCreateUpdateReplaceRecordResponse res;

            using (AirtableBase airTable = new AirtableBase(this.m_ApiKey, baseId))
            {
                res = await airTable.UpdateRecord(tableName, fields, model.Id);
            }

            return res;
        }
```

修改資料是呼叫 `UpdateRecord` 方法，和新增資料類似，只差別在 `UpdateRecord` 會多傳唯一 `Id` 鍵值。

## 結論

目前覺得 [AirTable](https://airtable.com/) 寫 Side Project 的好幫手，除了上次的 TypeScript 的版本外，而這次想轉成 .net core 的版本，之後我在將這些程式包裝成 Nuget 的版本，請大家參考看看。

原始碼位置：[https://github.com/thomascsd/BookApi](https://github.com/thomascsd/BookApi)
