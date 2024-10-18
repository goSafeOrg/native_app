import useScreenSize from '@/hooks/useScreenSize';
import { error800, neutral100, neutral400, neutral500, primary500 } from '@/utils/constants/colors';
import { calenderIcon } from '@/utils/constants/images';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import CustomModal from '../modals/Modal';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
export default function DatePicker({label,placeholder,date,setDate,mandatory}:{label:string, placeholder:string ,date:DateType,setDate:(value: {date: DateType})=>void, mandatory?:boolean}) {
  const [showDatePicker,setShowDatePicker] = useState(false)
  const locale= 'en';
  const isMobile = useScreenSize()

  return (
    <View style={{width:'100%', marginTop:8, gap:8}}>
      <View style={{gap:8}}>
        <View style={{flexDirection:'row'}}>
          <Text style={{fontSize:18}}>
              {label}
          </Text>
          <Text style={{color:error800}}>{mandatory ? " *" : ''}</Text>
        </View>
        <View style={{flexDirection:'row', padding: isMobile ? 12 : 16 , backgroundColor:neutral100, alignItems:'center', justifyContent:'space-between', borderWidth:1,borderColor:neutral500, borderRadius:8}}>
            <Text style={{fontSize:14}}>
                {date ? dayjs(date).locale(locale).format('DD-MMMM-YYYY') : placeholder}
            </Text>
            <TouchableOpacity onPress={()=>setShowDatePicker(prev=>!prev)}>
                <Image style={{width:20, height:20}} source={calenderIcon} />
            </TouchableOpacity>
        </View>
      </View>
      <CustomModal heightProp='auto' visible={showDatePicker} hasClose={true} onClose={()=>setShowDatePicker(false)} makeItemsCenter={true}>
        <DateTimePicker
            selectedItemColor={primary500}
            headerButtonColor = {primary500}
            headerTextStyle={{color:primary500}}
            mode="single"
            date={date}
            onChange={(date)=>{setDate(date);setShowDatePicker(false)}}
        />
      </CustomModal>
    </View>
  )
}