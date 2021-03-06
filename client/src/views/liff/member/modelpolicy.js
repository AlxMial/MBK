import Modal from "react-modal";
const ModelPolicy = ({ isOpen, closemodel }) => {
    return <Modal
        isOpen={isOpen}
        className="Modal-line"
        style={{ borderRadius: "10px" }}
    >
        <div className="w-full flex flex-wrap" style={{ height: "100%" }}>
            <div className="w-full flex-auto relative">
                <div className=" flex justify-between align-middle ">
                    <div className="w-full align-middle flex" style={{
                        justifyContent: "center"
                    }}>
                        <div className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-base text-green-mbk font-bold whitespace-nowrap p-4">
                            <label>{"ข้อกำหนดและเงื่อนไข "}</label>
                        </div>
                    </div>

                    <div className="  text-right align-middle absolute " style={{
                        right: "0"
                    }}>
                        <div className=" border-t-0 px-6 align-middle border-l-0 border-r-0 text-sm text-red-500 font-bold whitespace-nowrap p-4">
                            <label
                                className="cursor-pointer"
                                onClick={closemodel}
                            >
                                <i className="flex fas fa-times" style={{ alignItems: "center" }}></i>
                            </label>
                        </div>
                    </div>
                </div>

            </div>

            <div className="line-scroll" style={{ width: "100%", height: "calc(100% - 50px)", backgroundColor: "#f7f6f6", borderRadius: "10px" }}>
                <div className="px-2 py-2 text-green-mbk" style={{ fontSize: "11px" }}>
                    <div className="font-bold">ข้อกำหนดและเงื่อนไข : สำหรับสมาชิกข้าวมาบุญครอง (“สมาชิก”) </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ข้าพเจ้ามีความประสงค์จะขอรับหมายเลขสมาชิกและเป็นสมาชิก โดยรับทราบ ตกลง และยอมรับข้อกำหนดและเงื่อนไข ดังต่อไปนี้ </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้าตกลงให้ บริษัท พี อาร์ จี คอร์ปอเรชั่น จำกัด (มหาชน) (เรียกว่า “บริษัท”) ดำเนินการให้บริการแพลตฟอร์มและรับสมัครให้ข้าพเจ้าเป็นสมาชิกจนกว่าบริษัทยกเลิกการเป็นสมาชิกของข้าพเจ้าเนื่องจากข้าพเจ้าไม่มีการสะสม แลก หรือโอนคะแนนภายในระยะเวลา 1 (หนึ่ง) ปีติดต่อกันและไม่มีคะแนนสะสมคงเหลือ </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้ารับทราบว่าการเก็บรวบรวม ใช้ เปิดเผย หรือโอนข้อมูลส่วนบุคคลของข้าพเจ้าไปต่างประเทศจะเป็นไปตามนโยบายความเป็นส่วนตัว </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>3.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้ารับทราบว่า คะแนนจากการเป็นสมาชิกแต่ละคะแนนมีอายุตามที่บริษัทกำหนดไว้ในเงื่อนไขของแต่ละโปรโมชั่น (1 (หนึ่ง) เดือน/ 3 (สาม) เดือน/ 6 (หก) เดือน/ หรือ 1 (หนึ่ง) ปี) นับจากวันที่ซื้อสินค้าหรือบริการ  </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>4.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ในกรณีที่มีข้อโต้แย้งเกี่ยวกับคะแนนจากการเป็นสมาชิก ข้าพเจ้าตกลงและยอมรับให้บริษัทมีอำนาจในการตรวจสอบและระงับข้อโต้แย้ง โดยการตัดสินของบริษัทถือเป็นที่สุด  </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>5.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้ายอมรับว่าสิทธิประโยชน์ที่ทางบริษัทเสนอให้แก่สมาชิกแต่ละรายอาจแตกต่างกัน ขึ้นอยู่กับประวัติการซื้อสินค้าของสมาชิกแต่ละราย รายการโปรโมชั่นสินค้าแต่ละประเภท และ/หรือนโยบายทางการตลาดของบริษัท </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>6.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้าตกลงและยอมรับว่า หากข้าพเจ้าคืนสินค้าที่ซื้อจากร้านค้าที่ร่วมโครงการกับบริษัทแล้ว ข้าพเจ้าต้องคืนคะแนนสะสมที่ได้รับและรวมทั้งของรางวัลที่แลกรับจากคะแนนสะสมไปแล้ว หรือคืนเป็นเงินสดตามมูลค่าของของรางวัล  </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>7.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้าตกลงและยอมรับว่าบริษัทมีสิทธิ์ปฏิเสธการให้บริการแพลตฟอร์มและการสมัครนี้ หรือสามารถยกเลิกการเป็นสมาชิกได้โดยไม่จำเป็นต้องระบุสาเหตุการปฏิเสธ/ยกเลิกดังกล่าว </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>8.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้ายอมรับและผูกพันตามข้อกำหนดและเงื่อนไขของการเป็นสมาชิกที่บริษัทกำหนดไว้ขณะลงทะเบียนใช้บริการแพลตฟอร์มและรวมทั้งการเปลี่ยนแปลงแก้ไขที่อาจมีขึ้นในภายหน้า โดยบริษัทมิต้องแจ้งให้ทราบล่วงหน้า </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>9.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ข้าพเจ้าตกลงและยอมรับว่าบริษัทมีสิทธิ์เด็ดขาดฝ่ายเดียวในการเปลี่ยนแปลงเงื่อนไขการเป็นสมาชิก/ของกำนัลที่จัดให้แลกและสิทธิพิเศษต่าง ๆ โดยมิต้องแจ้งให้ทราบล่วงหน้า </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>10.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>กรณีที่มีปัญหาขัดแย้งจากการเป็นสมาชิก คำชี้ขาดของบริษัทถือเป็นที่สิ้นสุด  </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>11.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>บริษัทฯ ขอสงวนสิทธิ์ในการยกเลิกการเป็นสมาชิก หรือเปลี่ยนแปลงเงื่อนไขสิทธิประโยชน์โดยไม่ต้องแจ้งให้ทราบล่วงหน้า </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>12.</div>
                        <div style={{ width: "calc(100% - 30px)" }}>หากคุณไม่ประสงค์ที่จะรับการติดต่อสื่อสารทางการตลาดจากบริษัท และ/หรือ บริษัทในกลุ่มอ็มบีเค และ/หรือ บริษัทในเครือ และ/หรือ บริษัทที่เป็นพันธมิตรทางการค้ากับบริษัท โปรดติดต่อบริษัทมาที่ MKTONLINE@PRG.CO.TH หรือฝ่ายบริการลูกค้าที่หมายเลข 1285 ได้ทุกวัน 24 ชั่วโมง  </div>
                    </div>
                    <div className="font-bold">ข้อกำหนดและเงื่อนไขการใช้แพลตฟอร์ม  </div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;บริษัท พี อาร์ จี คอร์ปอเรชั่น จำกัด (มหาชน) (“บริษัท”) ได้จัดทำ Application บน LINE Official Account เพื่อใช้เป็นช่องทางในการติดต่อและสื่อสาร รวมถึงให้บริการแก่ผู้ใช้บริการที่เป็นสมาชิกของ ข้าวมาบุญครอง (“สมาชิก”) เช่น การสมัครเป็นสมาชิก ตรวจสอบคะแนนคงเหลือและคะแนนที่จะหมดอายุ ปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก ตรวจสอบแคมเปญส่งเสริมการขายของบริษัท และ/หรือพันธมิตรทางธุรกิจ แลกคะแนนสะสมตามรายการที่บริษัทกำหนด และโอนคะแนนสะสมระหว่างสมาชิกและ/หรือพันธมิตรทางธุรกิจ รวมถึงวัตถุประสงค์อื่น ๆ ตามที่บริษัทจะกำหนดขึ้นในภายหลัง</div>
                    <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ใช้งานแพลตฟอร์ม (“ผู้ใช้งาน”)ได้อ่าน และยอมรับว่าผู้ใช้งานจะต้องผูกพันตามข้อกำหนดและเงื่อนไขที่กำหนดไว้ในแพลตฟอร์มนี้ โดยผู้ใช้งานจะต้องศึกษาข้อกำหนดและเงื่อนไขด้านล่างนี้อย่างละเอียดและรอบคอบก่อนที่จะกระทำธุรกรรมหรือกิจกรรมใด ๆ บนแพลตฟอร์มนี้ หากท่านทำธุรกรรมหรือกิจกรรมใด ๆ บนแพลตฟอร์ม ให้ถือว่าท่านได้ยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขฉบับนี้แล้ว และหากท่านไม่ต้องการที่จะผูกพันภายใต้เงื่อนไขนี้ กรุณาหยุดทำธุรกรรมใด ๆ บนแพลตฟอร์มนี้  ทั้งนี้ บริษัทมีสิทธิที่จะแก้ไข เปลี่ยนแปลง หรือยกเลิกข้อกำหนดและเงื่อนไขนี้ และ/หรือข้อตกลงอื่น ๆ ในแพลตฟอร์มนี้ โดยไม่ต้องแจ้งให้สมาชิกและผู้ใช้งานทราบล่วงหน้า </div>
                    <div className="font-bold">1.ขอบเขตการใช้งานแพลตฟอร์ม และข้อกำหนดทั่วไป </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.1</div>
                        <div style={{ width: "calc(100% - 30px)" }}>บริษัทขอสงวนสิทธิไว้สำหรับสมาชิกที่ลงทะเบียนเป็นสมาชิกบนแพลตฟอร์มเพื่อตรวจสอบคะแนนคงเหลือและคะแนนที่จะหมดอายุ ปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก ตรวจสอบแคมเปญส่งเสริมการขายของบริษัท และ/หรือพันธมิตรทางธุรกิจ แลกคะแนนสะสมตามรายการที่บริษัทกำหนด และโอนคะแนนสะสมระหว่างสมาชิกอื่นและ/หรือพันธมิตรทางธุรกิจ รวมถึงวัตถุประสงค์อื่น ๆ ตามที่บริษัทอาจกำหนดขึ้นในภายหลัง </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.2</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้ใช้งานรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในแพลตฟอร์มเป็นข้อมูลของผู้ใช้งานที่ถูกต้องครบถ้วน โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือ หรืออีเมลส่วนตัวยังใช้งานได้อยู่ในขณะที่ให้ข้อมูลดังกล่าว</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.3</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้ใช้งานตกลงและรับทราบว่า บริษัทไม่ได้ให้ความรับรองถึงความถูกต้องสมบูรณ์ของเนื้อหาที่ปรากฏอยู่บนแพลตฟอร์ม และไม่รับรองว่าแพลตฟอร์ม ปราศจากไวรัส หรือสิ่งอื่น ๆ ที่อาจจะกระทบต่ออุปกรณ์เคลื่อนที่ของท่าน </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.4</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ก่อนจะทำรายการใด ๆ ผ่านแพลตฟอร์ม ผู้ใช้งานจะต้องตรวจสอบชื่อและนามสกุล หมายเลขสมาชิกและคะแนนสะสม ซึ่งจะปรากฏบนแพลตฟอร์ม แอปพลิเคชั่นและอีเมลที่ส่งถึงท่านตามอีเมลแอดเดรสหรือข้อมูลส่วนบุคคลอื่นๆที่ใช้ในการการติดต่อที่ท่านได้ระบุไว้ หลังจากที่มีการทำธุรกรรมใดๆ ผ่านทางแพลตฟอร์มทุกครั้ง </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.5</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้ใช้งานจะตรวจสอบเงื่อนไขเกี่ยวกับสิทธิประโยชน์ อัตราการแลกคะแนน รวมถึงการเข้าร่วมกิจกรรมต่าง ๆ ที่ปรากฏอยู่บนแพลตฟอร์มก่อนการรับสิทธิประโยชน์ และการเข้าร่วมกิจกรรมต่าง ๆ ผ่านแพลตฟอร์ม </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.6</div>
                        <div style={{ width: "calc(100% - 30px)" }}>การใช้งานแพลตฟอร์มในแต่ละครั้ง ถือว่าผู้ใช้งานได้รับทราบถึงข้อตกลงและเงื่อนไขนี้ รวมถึงข้อตกลงและเงื่อนไขทีมีการเปลี่ยนแปลงแก้ไขและได้ใช้บังคับในเวลาดังกล่าวโดยครบถ้วนสมบูรณ์แล้ว โดยตกลงปฏิบัติตามข้อตกลงและเงื่อนไขดังกล่าวทุกประการ </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.7</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ในแพลตฟอร์มจะมีโฆษณา ไฮเปอร์ลิงก์ หรือดีพลิงก์ ไปยังเว็บไซต์หรือแอพพลิเคชั่นของบุคคลที่สาม รวมถึงแต่ไม่จำกัดเพียงลิงก์ไปยังแพลตฟอร์ม เวปไซต์ หรือแอพพลิเคชั่นของบริษัทในกลุ่มเซ็นทรัล บริษัทในเครือ บริษัทที่เกี่ยวข้อง บริษัทที่เป็นพันธมิตรทางการค้ากับบริษัท และ/หรือบริษัทอื่นใดที่อยู่ภายใต้เงื่อนไขการใช้ข้อมูล ซึ่งแพลตฟอร์ม เวปไซต์ หรือแอพพลิเคชั่นของบุคคลที่สามเหล่านั้นไม่ถือเป็นส่วนหนึ่งของแพลตฟอร์มของบริษัท และไม่อยู่ภายใต้การควบคุมหรือความรับผิดชอบของบริษัท เมื่อผู้ใช้งานทำการลิงก์ไปยังแพลตฟอร์ม เวปไซต์ หรือแอพพลิเคชั่นดังกล่าว เมื่อผู้ใช้งานจะออกจากแพลตฟอร์มของบริษัทและดำเนินการต่อไปภายใต้ความเสี่ยงของผู้ใช้งานเองทั้งหมด บริษัทไม่รับประกันถึงความถูกต้องแม่นยำและความน่าเชื่อถือของข้อมูลที่ระบุไว้บนเว็บไซต์ของบุคคลที่สาม และบริษัทขอปฏิเสธความรับผิดชอบทั้งหมดต่อการสูญเสียหรือเสียหายที่ผู้ใช้งานได้รับจากการอ้างอิงข้อความที่อยู่หรือไม่มีอยู่บนแพลตฟอร์ม เวปไซต์ หรือแอพพลิเคชั่นของบุคคลที่สาม การแสดงโฆษณาไม่ถือเป็นการแสดงการรับรองหรือแนะนำจากบริษัท</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.8</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ในกรณีที่มีเหตุอันสมควร บริษัทอาจระงับหรือยกเลิกการให้บริการ รวมถึงเปลี่ยนแปลงรายการส่งเสริมการขายผ่านแพลตฟอร์มได้โดยไม่ต้องประกาศ หรือแจ้งให้ทราบล่วงหน้า</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.9</div>
                        <div style={{ width: "calc(100% - 30px)" }}>คะแนนสะสมที่ปรากฏเมื่อมีการตรวจสอบคะแนน จะเป็นคะแนนสะสมของการซื้อครั้งล่าสุดของวันนี้ ยกเว้นในกรณีถ้ามีการจับจ่ายและการได้รับคะแนนจากการซื้อของวันนี้ที่ได้รับจากบริษัท และ/หรือพันธมิตรทางธุรกิจที่ทำการส่งคะแนนมาให้บริษัทในภายหลัง คะแนนจะถูกนำไปคำนวณและแสดงในวันถัดไป หรือตามเงื่อนไขของบริษัท และ/หรือพันธมิตรทางธุรกิจที่กำหนดไว้ </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.10</div>
                        <div style={{ width: "calc(100% - 30px)" }}>คะแนนสะสมที่แลกผ่านทางแพลตฟอร์ม จะถูกนำไปประมวลผลและหักออกจากคะแนนที่คงเหลืออยู่ทันที </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.11</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ในการแลกคะแนนบนแพลตฟอร์ม ผู้ใช้งานจะไม่ได้รับอีเมลสรุปการแลกคะแนน แต่สามารถตรวจสอบประวัติการแลกคะแนนได้ที่เมนู "ประวัติการใช้งาน"</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.12</div>
                        <div style={{ width: "calc(100% - 30px)" }}>เมื่อผู้ใช้งานทำการยืนยันการแลกคะแนนหรือโอนคะแนนบนแพลตฟอร์มเรียบร้อยแล้ว จะไม่สามารถขอคืนคะแนนได้</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.13</div>
                        <div style={{ width: "calc(100% - 30px)" }}>กรณีที่มีข้อโต้แย้งเกี่ยวกับคะแนน ข้าวมาบุญครอง ข้าพเจ้าตกลงและยอมรับให้บริษัทมีอำนาจในการตรวจสอบและปรับคะแนนย้อนหลังไม่เกิน 6 เดือน และการตัดสินของบริษัทถือเป็นที่สิ้นสุด</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.14</div>
                        <div style={{ width: "calc(100% - 30px)" }}> คะแนนสะสมที่แลกหรือโอน จะถูกหักจากคะแนนที่ใกล้หมดอายุที่สุดก่อน (มาก่อน ไปก่อน) </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.15</div>
                        <div style={{ width: "calc(100% - 30px)" }}>คะแนนสะสมจะมีอายุ 1 (หนึ่ง) ปี นับจากปีที่มีการซื้อสินค้า โดยบริษัทจะคำนวณคะแนนสะสมในวันสุดท้ายของทุกปีปฏิทินรวจสอบชื่อและนามสกุล หมายเลขสมาชิกและคะแนนสะสม ซึ่งจะปรากฏบนแพลตฟอร์มทุกครั้งก่อนจะทำการแลกคะแนนบนแพลตฟอร์ม</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>1.16</div>
                        <div style={{ width: "calc(100% - 30px)" }}>บริษัทฯ ไม่สนับสนุนการซื้อ-ขายคะแนนทุกรูปแบบ ผู้ที่ร่วมกระทำการซื้อ-ขายคะแนน อาจมีความผิด และทาง บริษัทฯ ไม่มีส่วนรับผิดชอบใดๆ กับการกระทำดังกล่าว  </div>
                    </div>
                    <div className="font-bold">2.การสมัครเป็นสมาชิก </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.1</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้ขอใช้บริการสามารถสมัครสมาชิกได้โดยจะต้องทำการให้รายละเอียดข้อมูลตามที่บริษัทกำหนด รวมทั้งได้รับอนุมัติจากบริษัทให้เป็นสมาชิก โดยผู้ใช้บริการต้องผูกพันและปฏิบัติตามข้อกำหนดและเงื่อนไขการเป็นสมาชิกเดอะวัน </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.2</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้สมัครตกลงและยอมรับตามข้อกำหนดและเงื่อนไขต่าง ๆ ของการเป็นสมาชิกที่ใช้บังคับ ณ ขณะลงทะเบียนใช้บริการแพลตฟอร์มในทุกช่องทางและให้รวมถึงข้อกำหนดและเงื่อนไขที่จะเปลี่ยนแปลงหรือแก้ไขในภายหน้า </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.3</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้สมัครรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในการลงทะเบียนเป็นสมาชิกถูกต้องครบถ้วน โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือ หรือ อีเมลส่วนตัวยังใช้งานอยู่ในขณะที่ได้ให้ข้อมูลดังกล่าว</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.4</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้สมัครเป็นสมาชิกต้องไม่เป็นผู้เยาว์และมีอายุตั้งแต่ 10 ปีบริบูรณ์ขึ้นไป  ไม่เป็นคนไร้ความสามารถ  รวมทั้งไม่เป็นคนเสมือนไร้ความสามารถ </div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>2.5</div>
                        <div style={{ width: "calc(100% - 30px)" }}>บริษัทขอสงวนสิทธิในการยกเลิกการเป็นสมาชิก หรือเปลี่ยนแปลงเงื่อนไขสิทธิประโยชน์โดยไม่ต้องแจ้งให้ทราบล่วงหน้า</div>
                    </div>
                    <div className="font-bold">3.การลงทะเบียนเพื่อเข้าใช้งานแพลตฟอร์ม </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>3.1</div>
                        <div style={{ width: "calc(100% - 30px)" }}>ผู้ขอใช้บริการสามารถลงทะเบียนเข้าใช้งานแพลตฟอร์มได้โดยจะต้องทำการให้รายละเอียดข้อมูลตามที่บริษัทกำหนด รวมทั้งได้รับอนุมัติจากบริษัทให้เป็นสมาชิก โดยผู้ใช้บริการต้องผูกพันและปฏิบัติตามข้อกำหนดและเงื่อนไขในการใช้บริการ อนึ่ง ผู้ขอใช้บริการต้องทำการตั้งรหัสผ่านสมาชิก โดยขั้นตอนการยืนยันโดยรหัสลับ (OTP) ที่ทางบริษัทจัดส่งให้ภายในระยะเวลาที่กำหนด ทั้งนี้ สมาชิกจะต้องรักษารหัสผ่านไว้เป็นความลับและไม่เปิดเผยหรือกระทำการใด ๆ ที่อาจทำให้ผู้อื่นทราบรหัสผ่าน</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>3.2</div>
                        <div style={{ width: "calc(100% - 30px)" }}> สมาชิกรับรองว่าบรรดาข้อมูลที่ได้ให้ไว้แก่บริษัทในการลงทะเบียนเข้าใช้แพลตฟอร์มนี้ถูกต้องครบถ้วน โดยเฉพาะอย่างยิ่งรับรองว่าเบอร์โทรศัพท์มือถือหรืออีเมลส่วนตัวยังใช้งานอยู่ในขณะที่ได้ให้ข้อมูลดังกล่าว </div>
                    </div>
                    <div className="font-bold">4. การปรับเปลี่ยนข้อมูลส่วนตัวของสมาชิก</div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>4.1</div>
                        <div style={{ width: "calc(100% - 30px)" }}>สมาชิกสามารถทำการปรับเปลี่ยนผ่านทางแพลตฟอร์ม</div>
                    </div>
                    <div className="flex">
                        <div style={{ width: "30px", textAlign: "center" }}>4.2</div>
                        <div style={{ width: "calc(100% - 30px)" }}>สมาชิกรับรองว่า หากมีการเปลี่ยนแปลงข้อมูลส่วนตัวของสมาชิก สมาชิกจะปรับปรุงข้อมูลส่วนตัวของสมาชิกให้ทันสมัยอยู่ตลอดเวลา </div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
}



export default ModelPolicy