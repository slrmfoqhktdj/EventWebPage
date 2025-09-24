package main

import (
	"bytes"
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"image/png"
	"log"
	"math/rand"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"text/template"
	"time"

	"context"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/pat"

	// "github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	// "github.com/unrolled/render"

	"github.com/urfave/negroni"
)

// var rd *render.Render = render.New()
// var store = sessions.NewCookieStore([]byte(os.Getenv("qweqweqweqweqwe")))

//jwt예제

// type Token struct {
// 	Header        Header
// 	Claims        Claims
// 	Signature     string
// 	SigningString string
// 	Method        SigningMethod
// }

// type Header struct {
// 	Typ string `json:"typ"`
// 	Alg string `json:"alg"`
// }

// type Claims map[string]interface{}

// type SigningMethod interface {
// 	Alg() string
// 	Verify(signingString, signature string) bool
// 	Sign(signingString string) string
// }

// type KeyPairECDSA struct {
// 	PrivateKey *ecdsa.PrivateKey
// 	PublicKey  []byte
// }

// type SigningMethodEs256 struct {
// 	Name         string
// 	KeyPairECDSA *KeyPairECDSA
// }

// func NewSigningMethodEs256(keypair *KeyPairECDSA) *SigningMethodEs256 {
// 	return &SigningMethodEs256{Name: "ES256", KeyPairECDSA: keypair}
// }

// func NewKeyPairECDSA() *KeyPairECDSA {
// 	var err error
// 	var keyPairECDSA KeyPairECDSA

// 	curve := elliptic.P256()
// 	keyPairECDSA.PrivateKey, err = ecdsa.GenerateKey(curve, rand.Reader)
// 	if err != nil {
// 		panic(err)
// 	}

// 	keyPairECDSA.PublicKey = append(keyPairECDSA.PrivateKey.X.Bytes(), keyPairECDSA.PrivateKey.PublicKey.Y.Bytes()...)

// 	return &keyPairECDSA
// }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// type User struct {
// 	ID       uint64 `json:"id"`
// 	Username string `json:"username"`
// 	Password string `json:"password"`
// }

// var user = User{
// 	ID:       1,
// 	Username: "username",
// 	Password: "password",
// }

// func Login(c *gin.Context) {
// 	var u User
// 	if err := c.ShouldBindJSON(&u); err != nil {
// 		c.JSON(http.StatusUnprocessableEntity, "Invalid json provided")
// 		return
// 	}
// 	//compare the user from the request, with the one we defined:
// 	if user.Username != u.Username || user.Password != u.Password {
// 		c.JSON(http.StatusUnauthorized, "Please provide valid login details")
// 		return
// 	}
// 	token, err := CreateToken(user.ID)
// 	if err != nil {
// 		c.JSON(http.StatusUnprocessableEntity, err.Error())
// 		return
// 	}
// 	c.JSON(http.StatusOK, token)
// }

/////
////
///
//
//
//
//
///
//
///
//
///
///

////////////////////////////////////////////////////////////////////////////////////////////////////구조체///////////////////////////////////////////////////////////////////////////////////////

// 페이지 구조체
type Page struct {
	Title string
}

type M_survey_Page struct {
	User       string
	SurveyList []M_survey_Page_list
}

// 페이지 정보 구조체
type M_survey_Page_list struct {
	Id          string
	Survey_name string
	Respondent  int
	Drawing     string
}

type survey_statistics_list struct {
	Q_content string
	A_content string
	A_resp    string
	Form      string
}

type Drawinglots_list struct {
	Item    string
	Num     string
	Checked string
}

// 커스텀 질문 등록 구조체
type Custom_data struct {
	R1 string `json:"r1"`
	R2 string `json:"r2"`
	R3 string `json:"r3"`
	R4 string `json:"r4"`
	R5 string `json:"r5"`
	R6 string `json:"r6"`
	R7 string `json:"r7"`
	C1 string `json:"c1"`
	// C2 string `json:"c2"`
}

// 유저 질문 등록 구조체
type Question_data struct {
	Id    int    `json:"id"`
	Id_t  int    `json:"id_t"`
	Order int    `json:"order"`
	Ctt   string `json:"ctt"`
	Type  string `json:"type"`
}

// 유저 답문 등록 구조체
type Resp_data struct {
	Id_q  int    `json:"id_q"`
	Order int    `json:"order"`
	Ctt   string `json:"ctt"`
}

// 유저 뽑기 아이템 등록 구조체
type Drwl_value struct {
	Pro string `json:"pro"`
	Cnt string `json:"cnt"`
}

// 투표한 정보 구조체
type Checked_list struct {
	Cnt string
}

////////////////////////////////////////////////////////////////////////////////////////////////////함수///////////////////////////////////////////////////////////////////////////////////////

// html 구획 나누기
var templ = func() *template.Template {

	//template 에 function 넣기
	funcadd := template.FuncMap{
		"add": func(a int, b int) int {
			return a + b
		},
	}

	// t := template.New("")
	t := template.New("").Funcs(funcadd)
	err := filepath.Walk("./", func(path string, info os.FileInfo, err error) error {
		if strings.Contains(path, ".html") {
			fmt.Println(path)
			_, err = t.ParseFiles(path)
			if err != nil {
				fmt.Println(err)
			}
		}
		return err
	})

	if err != nil {
		fmt.Print(err)
	}
	return t
}()

// db 유저 설문 반환
func User_m_survey(user_m string) []M_survey_Page_list {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	var r []M_survey_Page_list

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	rows, err := conn.Query("select s.id,s.name,s.res,(select name from draw_m d where s.id = d.id) from survey_m s where s.user = ?", user_m)
	if err != nil {
		fmt.Printf("rows1 : %s", err)
		os.Exit(1)
	}

	for rows.Next() {
		var id string
		var name string
		var res int
		var id_d string

		rows.Scan(&id, &name, &res, &id_d)

		log.Print(id)
		log.Print(id_d)
		s := M_survey_Page_list{id, name, res, id_d}
		r = append(r, s)
	}

	defer conn.Close()

	return r
}

// db 유저 설문 제목 등록
func User_survey_t(id int, user string, title string) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	rows, err := conn.Query("INSERT INTO survey_m(id,name,user,res) VALUES (?,?,?,?)", strconv.Itoa(id), title, user, 0)
	if err != nil {
		fmt.Printf("rows1 : %s", err)
		os.Exit(1)
	}

	log.Printf("User_survey_t : %v", rows)

	defer conn.Close()

}

// sql문 처리
func setupBindVars(stmt, bindVars string, len int) string {
	bindVars += ","
	stmt = fmt.Sprintf(stmt, strings.Repeat(bindVars, len))
	return strings.TrimSuffix(stmt, ",")
}

// db 설문 질문 등록
func User_survey_q(q_d []Question_data) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" User_survey_q err : %s", err)
	}

	vals := []interface{}{}
	for _, row := range q_d {
		// log.Printf("question row : %d , %d , %d ,%s ,%s", row.Id, row.Id_t, row.Order, row.Ctt, row.Type)
		vals = append(vals, row.Id, row.Id_t, row.Order, row.Ctt, row.Type)
	}
	sqlStr := "INSERT INTO survey_q(id,m_id,s_order,s_content,s_form) VALUES %s"
	sqlStr = setupBindVars(sqlStr, "(?,?,?,?,?)", len(q_d))
	_, err = conn.ExecContext(context.Background(), sqlStr, vals...)
	if err != nil {
		log.Printf("User_survey_q err : %s", err)
	}

	defer conn.Close()
}

// db 설문 답문 등록
func User_survey_a(r_d []Resp_data) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" User_survey_a err : %s", err)
	}

	vals := []interface{}{}
	for _, row := range r_d {
		log.Printf("answer row : %d ,%d ,%s", row.Id_q, row.Order, row.Ctt)
		vals = append(vals, row.Id_q, row.Order, row.Ctt)
	}
	sqlStr := "INSERT INTO survey_a(q_id,a_order,a_content,a_res) VALUES %s"
	sqlStr = setupBindVars(sqlStr, "(?,?,?,'0')", len(r_d))
	_, err = conn.ExecContext(context.Background(), sqlStr, vals...)
	if err != nil {
		log.Printf("User_survey_a err : %s", err)
	}

	defer conn.Close()
}

// 설문 통계 반환
func Survey_statistics_list(m_id string) []survey_statistics_list {

	// Q_content string
	// A_content string

	// A_resp    string
	// Form      string

	var result []survey_statistics_list
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" Survey_statistics_list err : %s", err)
	}

	rows, err := conn.Query("select q.id,a.id,q.s_content,q.s_form,a.a_content,a.a_res from survey_a a,survey_q q where q.id = a.q_id and q.m_id = ?", m_id)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for rows.Next() {
		var q_id string
		var a_id int
		var q_content string
		var form string
		var a_content string
		var a_res string

		rows.Scan(&q_id, &a_id, &q_content, &form, &a_content, &a_res)

		if form == "t" {
			row, err := conn.Query("select t_content from survey_a_t where q_id = ?", q_id)
			if err != nil {
				fmt.Println(err)
				os.Exit(1)
			}
			for row.Next() {
				var t_content string
				row.Scan(&t_content)
				a_content = t_content

				m := survey_statistics_list{q_content, a_content, a_res, form}
				result = append(result, m)

				log.Print("Text : " + a_content)
			}
			defer row.Close()

		} else {
			m := survey_statistics_list{q_content, a_content, a_res, form}
			result = append(result, m)
		}

		// m := survey_statistics_list{q_content, a_content, a_res, form}
		// result = append(result, m)
	}
	defer rows.Close()
	defer conn.Close()

	return result

}

//설문_ 뽑기 메인값 저장

func User_survey_drawing_m(m_id int, name string, x string, y string, rain string) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" survey_show_submit err : %s", err)
	}

	conn.Query("insert into draw_m (id,name,x,y,rain) values(?,?,?,?,?)", m_id, name, x, y, rain)

	defer conn.Close()
}

//설문_ 뽑기 아이템값 저장

func User_survey_drawing_v(m_id int, v_g []Drwl_value, x string, y string) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" survey_show_submit err : %s", err)
	}

	x_, _ := strconv.Atoi(x)
	y_, _ := strconv.Atoi(y)

	xy := x_ * y_

	var prenum = make(map[int]string)

	//텍스트 문자열 저장
	for _, value := range v_g {

		cnt, _ := strconv.Atoi(value.Cnt)

		for i := 0; i < cnt; i++ {
			for {
				num := rand.Intn(xy - 1)

				_, exist := prenum[num]

				if !exist {
					prenum[num] = value.Pro
					break
				}
			}
		}
	}

	vals := []interface{}{}
	for key, val := range prenum {
		vals = append(vals, m_id, val, strconv.Itoa(key))
	}
	sqlStr := "insert into draw_i (id_m,item,num) values %s"
	sqlStr = setupBindVars(sqlStr, "(?,?,?)", len(prenum))
	_, err = conn.ExecContext(context.Background(), sqlStr, vals...)
	if err != nil {
		log.Printf("User_survey_a err : %s", err)
	}

	// log.Println(prenum)
	// for key, val := range prenum {
	// 	rows, err := conn.Query("insert into draw_i (id_m,item,num) values(?,?,?)", m_id, val, strconv.Itoa(key))
	// 	log.Print("rows", rows)
	// 	if err != nil {
	// 		log.Print("err:", err)
	// 	}

	// }

	// for k := 1; k <= xy; k++ {
	// 	conn.Query("insert into draw_c (id,id_i,checked) values(?,?,?)", k, m_id, 0)
	// }

	defer conn.Close()
}

//설문_뽑기_사이즈 맵 반환

func User_survey_drawing_size_map(x string, y string, id string) map[int]map[int]Drawinglots_list {

	x_, _ := strconv.Atoi(x)
	y_, _ := strconv.Atoi(y)

	v_map := User_survey_drawing_list_v(id)
	c_map := User_survey_drawing_checked_list_v(id)

	var m Drawinglots_list

	var x_map = make(map[int]map[int]Drawinglots_list)

	var xy_cnt = 1

	for i := 0; i < x_; i++ {
		var y_map = make(map[int]Drawinglots_list)
		for k := 0; k < y_; k++ {
			vals, exists := v_map[strconv.Itoa(xy_cnt)]
			_, exist := c_map[strconv.Itoa(xy_cnt)]
			if exists {
				if exist {
					m = Drawinglots_list{vals, strconv.Itoa(xy_cnt), "c"}
				} else {
					m = Drawinglots_list{vals, strconv.Itoa(xy_cnt), ""}
				}
			} else {
				if exist {
					m = Drawinglots_list{"", strconv.Itoa(xy_cnt), "c"}
				} else {
					m = Drawinglots_list{"", strconv.Itoa(xy_cnt), ""}
				}
			}
			y_map[k] = m
			xy_cnt++
		}
		x_map[i] = y_map
	}

	return x_map
}

// 설문_뽑기_정보 반환

func User_survey_drawing_list_v(id string) map[string]string {

	var result = make(map[string]string)
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" Survey_statistics_list err : %s", err)
	}

	rows, err := conn.Query("select item,num from draw_i where id_m = ?", id)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for rows.Next() {
		var item string
		var num string

		rows.Scan(&item, &num)

		result[num] = item

	}
	defer rows.Close()
	defer conn.Close()

	return result
}

// 설문_뽑기_뽑았던 객체 반환

func User_survey_drawing_checked_list_v(id string) map[string]string {

	var result = make(map[string]string)
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" Survey_statistics_list err : %s", err)
	}

	rows, err := conn.Query("select id from draw_c where id_i = ?", id)
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}

	for rows.Next() {
		var num string

		rows.Scan(&num)

		result[num] = ""

	}
	defer rows.Close()
	defer conn.Close()

	return result
}

func custom_save_submit_img(c_id string, dirname string, d_map map[string]string) {

	for key, val := range d_map {

		slice_b := strings.Split(val, ",")
		if len(slice_b) > 1 {
			unbased, err := base64.StdEncoding.DecodeString(slice_b[1])
			if err != nil {
				log.Print("Cannot decode b64")
			}

			reader := bytes.NewReader(unbased)
			im, err := png.Decode(reader)
			if err != nil {
				log.Print("Bad png")
			}

			filepath := fmt.Sprintf("%s/%s", dirname, c_id+key+".png")
			f, err := os.OpenFile(filepath, os.O_WRONLY|os.O_CREATE, 0777)
			if err != nil {
				log.Println(err)
				log.Print("Cannot open file")
			}

			defer f.Close()

			png.Encode(f, im)
		} else {
			log.Printf("index out of range err")
		}

	}
}

func Custom_data_save(_id string, c_v []Custom_data, b_map map[string]string) {
	dbname := os.Getenv("DBNAME")
	dbdata := os.Getenv("DBDATA")

	conn, err := sql.Open(dbname, dbdata)
	if err != nil {
		log.Printf(" Custom_data_save err : %s", err)
	}

	conn.Query("insert into custom_survey_7 (id,r1,r2,r3,r4,r5,r6,r7,c1,v1) values(?,?,?,?,?,?,?,?,?,?)", _id, c_v[0].R1, c_v[0].R2, c_v[0].R3, c_v[0].R4, c_v[0].R5, c_v[0].R6, c_v[0].R7, c_v[0].C1, b_map["_1"])

	defer conn.Close()
}

////////////////////////////////////////////////////////////////////////////////////////////////////페이지///////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// 커스텀 페이지
func m_custom_Handler(w http.ResponseWriter, r *http.Request) {

	s := time.Now()
	t := s.Format("2006-01-02-15-04-05") + "-" + strconv.Itoa(s.Nanosecond())
	fmt.Println(t)

	templ.ExecuteTemplate(w, "m_custom", &Page{Title: t})
}

// 커스텀 제출
func custom_submit_Handler(w http.ResponseWriter, r *http.Request) {
	c_id := r.FormValue("custom_id")
	var b_map = make(map[string]string)
	var d_map = make(map[string]string)

	b1 := r.FormValue("custom_text1")

	if b1 != "" {
		b_map["_1"] = b1

		d_map["_1"] = b1

		//이미지 생성 경로 = 저장 이미지의 파일 따로 만듬
		// dirname := "./custom_folder_yeosu/" + c_id

		//이미지 생성 경로
		dirname := "./custom_folder/"
		os.MkdirAll(dirname, 0777)

		go custom_save_submit_img(c_id, dirname, d_map)

		custom_data_get := r.FormValue("custom_value")
		var c_v []Custom_data
		json.Unmarshal([]byte(custom_data_get), &c_v)

		Custom_data_save(c_id, c_v, b_map)
	} else {
		log.Print("custom_submit err")
	}

	// templ.ExecuteTemplate(w, "custom_drawinglots", &Page{Title: "custom_drawinglots"})
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

func main() {
	err := godotenv.Load("./public/info.env")
	if err != nil {
		log.Println(err)
		return
	}

	mux := pat.New()

	//negroni를 쓰면 따로 명시하지 않을시 "/"에 접근하면 index.html or default.html 파일에 액세스함
	n := negroni.Classic()

	mux.Path("/").HandlerFunc(m_custom_Handler)
	mux.Path("/custom_submit").HandlerFunc(custom_submit_Handler)

	n.UseHandler(mux)
	http.ListenAndServe(":8060", n)
}
