function GeneralErrorFromDB(stringError) {
  //validate empty string
  return stringError
    ? stringError.split('ORA-')[1].replace('20009:', '').trim()
    : '';
}
export default GeneralErrorFromDB;
